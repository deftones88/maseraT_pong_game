import React from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ChatParticipantType } from "../type/chat-participant-type";
import { Chat } from "../component/chat";
import { ChatType } from "../type/chat-type";
import { socket } from "../App";
import { getCookie } from "../func/get-cookie";
import { UserList } from "../component/list/user-list";
import { Authority } from "../type/enum/authority.enum";
import { ChatRoomSetPopup } from "../popup/chat-room-set-popup";
import TopBar from "../component/TopNavBar";
import Button from "../component/button/Button";

export function ChatDetail() {
  const { chatRoomId } = useParams();
  const [participants, setParticipants] = useState<ChatParticipantType[]>([]);
  const [title, setTitle] = useState("");
  const [chats, setChats] = useState<ChatType[]>([]);
  const [message, setMessage] = useState("");
  const [authority, setAuthority] = useState(Authority.PARTICIPANT);
  const [isRoomSet, setIsRoomSet] = useState(false);

  const navigate = useNavigate();

  const ref = useRef(null);
  // @ts-ignore
  const onSideClick = (e) => {
    // @ts-ignore
    if (!ref.current.contains(e.target)) setIsRoomSet(false);
  };

  useEffect(() => {
    if (chatRoomId) {
      localStorage.setItem("chatRoomId", chatRoomId);
    }

    fetch(process.env.REACT_APP_API_URL + "chat/room/" + chatRoomId, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((json) => {
        setParticipants(json.chatParticipant);
        // @ts-ignore
        json.chatParticipant.forEach((participant) => {
          if (participant.userId === +getCookie("id")) {
            localStorage.setItem("authority", participant.authority);
            setAuthority(participant.authority);
          }
        });
        setTitle(json.title);
      });

    window.addEventListener("click", onSideClick);

    return () => {
      socket.emit("chat-room-leave", { chatRoomId, userId: getCookie("id") });
      localStorage.removeItem("authority");
      window.removeEventListener("click", onSideClick);
    };
  }, [chatRoomId, navigate]);

  useEffect(() => {
    socket.on("chat-room-leave", ({ nickname, userId }) => {
      setParticipants((curr) =>
        curr.filter((idx) => {
          return +idx.userId !== +userId;
        }),
      );

      setChats((curr) => {
        return [
          ...curr,
          { nickname: "", message: nickname + "(이)가 나갔습니다" },
        ];
      });
    });

    socket.on("chat-room-message", (chatType: ChatType) => {
      setChats((curr) => [...curr, chatType]);
    });

    socket.on("chat-room-join", (participant: ChatParticipantType) => {
      setParticipants((curr) => {
        return [
          ...curr,
          {
            nickname: participant.nickname,
            userId: participant.userId,
            authority: participant.authority,
          },
        ];
      });

      setChats((curr) => {
        return [
          ...curr,
          {
            nickname: "",
            message: participant.nickname + "(이)가 입장했습니다.",
          },
        ];
      });
    });

    socket.on("chat-room-set-admin", ({ userId, authority }) => {
      if (userId === +getCookie("id")) {
        localStorage.setItem("authority", authority);
        setAuthority(authority);
      }

      setParticipants((curr) => {
        curr.forEach((participant) => {
          if (+participant.userId === userId) participant.authority = authority;
        });
        curr.sort((a, b) => b.authority - a.authority);
        return [...curr];
      });
    });

    socket.on("chat-room-kick", ({ targetId }) => {
      if (targetId === getCookie("id")) {
        navigate("/chat");
      }
      setParticipants((curr) => curr.filter((c) => c.userId !== targetId));
    });

    socket.on("chat-room-setting", ({ title }) => {
      setTitle(title);
    });

    return () => {
      socket.off("chat-room-leave");
      socket.off("chat-room-message");
      socket.off("chat-room-join");
      socket.off("chat-room-set-admin");
      socket.off("chat-room-kick");
    };
  }, [participants, chats, navigate]);

  const onClick = () => {
    socket.emit("chat-room-message", {
      chatRoomId,
      userId: getCookie("id"),
      message,
    });
    setMessage("");
  };

  const onChange = (e: any) => {
    setMessage(e.target.value);
  };

  const onRoomSet = () => {
    setIsRoomSet(true);
  };

  return (
    <div className="h-full flex flex-col">
      <TopBar>
        <div className="content">
          <div className="content-box w-[550px] mr-3 my-5 relative rounded-none rounded-r-lg rounded-bl-lg">
            <div className="absolute top-[-30px] left-[-2px] border-main border-x-2 border-t-2 bg-white w-[60%] h-[31px] rounded-t-lg px-2 py-1 text-center">
              <div className="absolute left-5 cursor-pointer">
                <NavLink to="/chat">&lt;</NavLink>
              </div>
              <div>
                <span className="font-main text-main-text">
                  "{title}" 제목의 채팅방
                </span>
              </div>
            </div>
            <div className="w-full h-full flex flex-col justify-start items-center">
              <div className="w-[90%] h-[80%] border-main border-2 mt-7 p-1 font-main">
                <ul>
                  {chats.map((chat, index) => {
                    return (
                      <Chat
                        key={index}
                        nickname={chat.nickname}
                        msg={chat.message}
                      />
                    );
                  })}
                </ul>
              </div>
              <div className="w-[90%] flex justify-between mt-4">
                <input
                  type="text"
                  className="w-[85%] border-main border-2 rounded px-2 py-1 text-sm font-main"
                  onChange={onChange}
                  value={message}
                />
                <div>
                  <Button
                    tag="전송"
                    className="btn-sm py-1"
                    onClick={onClick}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <UserList isChatRoom={true} participants={participants} />
            <div ref={ref}>
              {authority >= Authority.ADMIN ? (
                <button onClick={onRoomSet}>설정</button>
              ) : null}
              {isRoomSet ? (
                <ChatRoomSetPopup
                  chatRoomId={chatRoomId}
                  roomTitle={title}
                  setIsRoomSet={setIsRoomSet}
                />
              ) : null}
            </div>
          </div>
        </div>
      </TopBar>
    </div>
  );
}