import { ImagePlus, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import { Input } from "../../components/FormField";
import { EmptyState, Loader } from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { api, getErrorMessage } from "../../services/api";
import { connectSocket, getSocket } from "../../services/socket";

const initials = (name = "") => name.slice(0, 2).toUpperCase();

export default function Chat() {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [targets, setTargets] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const messageEndRef = useRef(null);

  const loadConversations = async () => {
    const { data } = await api.get("/chat/conversations");
    setConversations(data.items);
    if (!active && data.items[0]) setActive(data.items[0]);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [conversationResponse, targetsResponse] = await Promise.all([
        api.get("/chat/conversations"),
        api.get("/users/chat-targets"),
      ]);
      setConversations(conversationResponse.data.items);
      setTargets(targetsResponse.data.items);
      setActive(conversationResponse.data.items[0] || null);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!token) return undefined;
    const socket = getSocket() || connectSocket(token);
    const onMessage = (message) => {
      if (String(message.conversation) === String(active?._id)) {
        setMessages((current) => {
          if (current.some((item) => item._id === message._id)) return current;
          return [...current, message];
        });
      }
      loadConversations();
    };
    socket?.on("message:new", onMessage);
    return () => socket?.off("message:new", onMessage);
  }, [active?._id, token]);

  useEffect(() => {
    if (!active) {
      setMessages([]);
      return;
    }
    api.get(`/chat/conversations/${active._id}/messages`).then(({ data }) => setMessages(data.items));
  }, [active?._id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeParticipant = useMemo(() => {
    if (!active) return null;
    return active.participants?.find((participant) => String(participant._id) !== String(user._id));
  }, [active, user._id]);

  const startConversation = async (targetId) => {
    try {
      const { data } = await api.post("/chat/conversations", { targetUserId: targetId });
      await loadConversations();
      setActive(data.conversation);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const send = async (event) => {
    event.preventDefault();
    if (!text && !image) return;

    const data = new FormData();
    data.append("conversationId", active._id);
    if (text) data.append("text", text);
    if (image) data.append("image", image);

    try {
      const response = await api.post("/chat/messages", data);
      setMessages((current) => [...current, response.data.item]);
      setText("");
      setImage(null);
      await loadConversations();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <PageHeader title="Chat" description="Communicate with Panchayat admins, citizens, and verified workers based on your role." />
      <div className="grid min-h-[70vh] overflow-hidden rounded-lg border border-neutral-200 bg-white lg:grid-cols-[320px_1fr]">
        <aside className="border-b border-neutral-200 lg:border-b-0 lg:border-r">
          <div className="border-b border-neutral-200 p-4">
            <p className="text-sm font-black">Start conversation</p>
            <select className="field mt-3" defaultValue="" onChange={(e) => e.target.value && startConversation(e.target.value)}>
              <option value="">Choose user</option>
              {targets.map((target) => (
                <option key={target._id} value={target._id}>{target.name} - {target.role}</option>
              ))}
            </select>
          </div>
          <div className="max-h-[62vh] overflow-y-auto p-2 app-scrollbar">
            {conversations.length === 0 ? <EmptyState title="No conversations" /> : conversations.map((conversation) => {
              const other = conversation.participants?.find((participant) => String(participant._id) !== String(user._id));
              return (
                <button
                  key={conversation._id}
                  className={`mb-2 flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${active?._id === conversation._id ? "border-black bg-black text-white" : "border-neutral-200 hover:border-black"}`}
                  onClick={() => setActive(conversation)}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xs font-black ${active?._id === conversation._id ? "bg-white text-black" : "bg-black text-white"}`}>
                    {initials(other?.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">{other?.name}</span>
                    <span className="block truncate text-xs opacity-70">{conversation.lastMessage?.text || "Image message"}</span>
                  </span>
                  {conversation.unreadCount ? <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-black">{conversation.unreadCount}</span> : null}
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex min-h-[70vh] flex-col">
          {active ? (
            <>
              <div className="border-b border-neutral-200 p-4">
                <p className="font-black">{activeParticipant?.name}</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{activeParticipant?.role}</p>
              </div>
              <div className="flex-1 overflow-y-auto bg-neutral-50 p-4 app-scrollbar">
                {messages.map((message) => {
                  const mine = String(message.sender?._id || message.sender) === String(user._id);
                  return (
                    <div key={message._id} className={`mb-3 flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[78%] rounded-lg border p-3 ${mine ? "border-black bg-black text-white" : "border-neutral-200 bg-white text-black"}`}>
                        {message.image?.url ? <img src={message.image.url} alt="" className="mb-2 max-h-60 rounded-lg object-cover" /> : null}
                        {message.text ? <p className="text-sm leading-6">{message.text}</p> : null}
                        <p className="mt-2 text-[11px] opacity-60">{new Date(message.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messageEndRef} />
              </div>
              <form onSubmit={send} className="flex flex-col gap-2 border-t border-neutral-200 p-3 md:flex-row">
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" />
                <label className="focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold">
                  <ImagePlus size={16} />
                  <span>Image</span>
                  <input className="sr-only" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                </label>
                <Button type="submit" icon={Send}>Send</Button>
              </form>
            </>
          ) : (
            <EmptyState title="Select a conversation" />
          )}
        </section>
      </div>
    </>
  );
}
