import {
  ImagePlus,
  Send,
  MessageCircle,
  Users,
} from "lucide-react";
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
          if (current.some((item) => item._id === message._id)) {
            return current;
          }

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

    api
      .get(`/chat/conversations/${active._id}/messages`)
      .then(({ data }) => setMessages(data.items));
  }, [active?._id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const activeParticipant = useMemo(() => {
    if (!active) return null;

    return active.participants?.find(
      (participant) =>
        String(participant._id) !== String(user._id)
    );
  }, [active, user._id]);

  const startConversation = async (targetId) => {
    try {
      const { data } = await api.post("/chat/conversations", {
        targetUserId: targetId,
      });

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

      setMessages((current) => [
        ...current,
        response.data.item,
      ]);

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
      <style>{`
        @keyframes chat-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes chat-float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .chat-card {
          animation: chat-rise .6s cubic-bezier(.22,1,.36,1) both;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .chat-float {
          animation: chat-float 3s ease-in-out infinite;
        }
      `}</style>

      <PageHeader
        title="Chat"
        description="Communicate with Panchayat admins, citizens, and verified workers based on your role."
      />

      <div className="chat-card grid min-h-[78vh] overflow-hidden rounded-3xl lg:grid-cols-[340px_1fr]">
        {/* LEFT SIDEBAR */}
        <aside className="border-b border-white/10 lg:border-b-0 lg:border-r">
          {/* start conversation */}
          <div className="border-b border-white/10 p-5">
            <div className="mb-4 flex items-center gap-4">
              <div
                className="
                  chat-float
                  grid
                  h-14
                  w-14
                  place-items-center
                  rounded-2xl
                  border
                  border-indigo-400/20
                  bg-gradient-to-br
                  from-indigo-500/20
                  to-violet-500/10
                  text-indigo-300
                "
              >
                <Users size={24} />
              </div>

              <div>
                <h2 className="text-xl font-black text-white">
                  Conversations
                </h2>
                <p className="text-sm text-neutral-400">
                  Start a new chat
                </p>
              </div>
            </div>

            <select
              className="field"
              defaultValue=""
              onChange={(e) =>
                e.target.value &&
                startConversation(e.target.value)
              }
            >
              <option value="">Choose user</option>

              {targets.map((target) => (
                <option
                  key={target._id}
                  value={target._id}
                >
                  {target.name} - {target.role}
                </option>
              ))}
            </select>
          </div>

          {/* conversation list */}
          <div className="max-h-[68vh] overflow-y-auto p-3 app-scrollbar">
            {conversations.length === 0 ? (
              <EmptyState title="No conversations" />
            ) : (
              conversations.map((conversation) => {
                const other =
                  conversation.participants?.find(
                    (participant) =>
                      String(participant._id) !==
                      String(user._id)
                  );

                return (
                  <button
                    key={conversation._id}
                    onClick={() => setActive(conversation)}
                    className={`
                      mb-3
                      flex
                      w-full
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      p-4
                      text-left
                      transition-all
                      duration-300
                      ${
                        active?._id === conversation._id
                          ? "border-indigo-400/20 bg-indigo-500/10"
                          : "border-white/10 bg-white/5 hover:border-indigo-400/20"
                      }
                    `}
                  >
                    <div
                      className={`
                        grid
                        h-12
                        w-12
                        shrink-0
                        place-items-center
                        rounded-2xl
                        text-sm
                        font-black
                        ${
                          active?._id === conversation._id
                            ? "bg-indigo-500 text-white"
                            : "bg-white/10 text-indigo-300"
                        }
                      `}
                    >
                      {initials(other?.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-white">
                        {other?.name}
                      </p>

                      <p className="truncate text-xs text-neutral-400">
                        {conversation.lastMessage?.text ||
                          "Image message"}
                      </p>
                    </div>

                    {conversation.unreadCount ? (
                      <span className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-black text-white">
                        {conversation.unreadCount}
                      </span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* RIGHT CHAT */}
        <section className="flex min-h-[78vh] flex-col">
          {active ? (
            <>
              {/* header */}
              <div className="border-b border-white/10 p-5">
                <div className="flex items-center gap-4">
                  <div
                    className="
                      grid
                      h-12
                      w-12
                      place-items-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-emerald-500/20
                      to-teal-500/10
                      text-emerald-300
                    "
                  >
                    <MessageCircle size={20} />
                  </div>

                  <div>
                    <p className="font-black text-white">
                      {activeParticipant?.name}
                    </p>

                    <p className="text-xs uppercase tracking-widest text-neutral-400">
                      {activeParticipant?.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* messages */}
              <div className="flex-1 overflow-y-auto bg-black/10 p-5 app-scrollbar">
                {messages.map((message) => {
                  const mine =
                    String(
                      message.sender?._id || message.sender
                    ) === String(user._id);

                  return (
                    <div
                      key={message._id}
                      className={`mb-4 flex ${
                        mine
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`
                          max-w-[78%]
                          rounded-3xl
                          border
                          p-4
                          ${
                            mine
                              ? "border-indigo-500 bg-indigo-500 text-white"
                              : "border-white/10 bg-white/6 text-white"
                          }
                        `}
                      >
                        {message.image?.url ? (
                          <img
                            src={message.image.url}
                            alt=""
                            className="mb-3 max-h-72 rounded-2xl object-cover"
                          />
                        ) : null}

                        {message.text ? (
                          <p className="text-sm leading-7">
                            {message.text}
                          </p>
                        ) : null}

                        <p className="mt-3 text-[11px] opacity-60">
                          {new Date(
                            message.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div ref={messageEndRef} />
              </div>

              {/* input */}
              <form
                onSubmit={send}
                className="flex flex-col gap-3 border-t border-white/10 p-4 md:flex-row"
              >
                <Input
                  value={text}
                  onChange={(e) =>
                    setText(e.target.value)
                  }
                  placeholder="Type a message"
                />

                <label
                  className="
                    inline-flex
                    min-h-10
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    px-5
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    cursor-pointer
                  "
                >
                  <ImagePlus size={16} />
                  <span>Image</span>

                  <input
                    className="sr-only"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImage(e.target.files[0])
                    }
                  />
                </label>

                <Button type="submit" icon={Send}>
                  Send
                </Button>
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