import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { BsChevronDown, BsPlusLg } from "react-icons/bs";
import useAutoResizeTextArea from "@/hooks/useAutoResizeTextArea";
import Message from "./Message";
import { DEFAULT_OPENAI_MODEL } from "@/shared/Constants";
import { SiOpenai } from "react-icons/si";

const Chat = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmptyChat, setShowEmptyChat] = useState(true);
  const [conversation, setConversation] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const textAreaRef = useAutoResizeTextArea();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedModdel, setSelectedModdel] = useState<string>("ChatGPT 3.5");
  const moddels: string[] = ["ChatGPT 3.5", "GPT 4"];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectModel = (moddel: string) => {
    setSelectedModdel(moddel);
    setIsOpen(false);
  }
  
  const selectedModel = DEFAULT_OPENAI_MODEL;

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "24px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [message, textAreaRef]);

  useEffect(() => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  const sendMessage = async (e: any) => {
    e.preventDefault();

    if (message.length < 1) {
      setErrorMessage("Please enter a message.");
      return;
    } else {
      setErrorMessage("");
    }
  
    setIsLoading(true);

    setConversation([
      ...conversation,
      { content: message, role: "user" },
      { content: null, role: "system" },
    ]);

    setMessage("");
    setShowEmptyChat(false);

    try {
      const response = await fetch(`/api/openai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...conversation, { content: message, role: "user" }],
          model: selectedModel,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        setConversation([
          ...conversation,
          { content: message, role: "user" },
          { content: data.message, role: "system" },
        ]);
      }
      else {
        console.error(response);
        setErrorMessage(response.statusText);
      }

      setIsLoading(false);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);

      setIsLoading(false);
    }
  };

  const handleKeypress = (e: any) => {
    if (e.keyCode == 13 && !e.shiftKey) {
      sendMessage(e);
      e.preventDefault();
    }
  };


  return (
    <div className="flex max-w-full flex-1 flex-col">
      <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1 overflow-hidden">
          <div className="react-scroll-to-bottom--css-ikyem-79elbk h-full dark:bg-gray-800">
            <div className="react-scroll-to-bottom--css-ikyem-1n7m0yu">

          {/* <div className="flex items-center gap-2" style={{height:""}}>
             <div className="relative" style={{height:"45px"}}>
        <button
          className="relative flex w-full cursor-default flex-col rounded-md bg-white py-2 pl-3 pr-10 text-left focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-white/20 dark:bg-gray-800 sm:text-sm align-center"
          id="headlessui-listbox-button-:r0:"
          type="button"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={toggleDropdown}
          aria-labelledby="headlessui-listbox-label-:r1: headlessui-listbox-button-:r0:"
                        style={{cursor:"pointer"}}

        >
          <span className="inline-flex w-full truncate">
            <span
              className="flex h-6 items-center gap-1 truncate text-white"
              style={{ fontWeight: "bold", fontSize: "18px" }}
            >
              {selectedModdel}
            </span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <BsChevronDown className="h-4 w-4 text-gray-400" />
          </span>
        </button>
        {isOpen && (
          <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-800">
            <ul
              tabIndex={-1}
              role="listbox"
              aria-labelledby="headlessui-listbox-label-:r1: headlessui-listbox-button-:r0:"
              aria-activedescendant="headlessui-listbox-option-0-0"
              className="max-h-60 overflow-auto focus:outline-none sm:text-sm ring-1 ring-black ring-opacity-5"
            >
              {moddels.map((moddel, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectModel(moddel)}
                  id={`headlessui-listbox-option-${index}-0`}
                  role="option"
                  className="text-gray-900 dark:text-white cursor-default select-none relative py-2 pl-3 pr-9"
                >
                  <span className="font-normal block truncate">{moddel}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div> */}

              {!showEmptyChat && conversation.length > 0 ? (
                <div className="flex flex-col items-center text-sm bg-gray-800">
                  <div className="flex w-full items-center justify-center gap-1 border-b border-black/10 bg-gray-50 p-3 text-gray-500 dark:border-gray-900/50 dark:bg-gray-700 dark:text-gray-300">
                   {selectedModdel}
                  </div>
                  {conversation.map((message, index) => (
                    <Message key={index} message={message} />
                  ))}
                  <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
                  <div ref={bottomOfChatRef}></div>
                </div>
              ) : null}
              {showEmptyChat ? (
                <div className="py-10 relative w-full flex flex-col h-full">
                 <div className="flex items-center gap-2" style={{height:"0px"}}>
      <div className="relative" style={{height:"45px"}}>
        <button
          className="relative flex w-full cursor-default flex-col rounded-md bg-white py-2 pl-3 pr-10 text-left focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-white/20 dark:bg-gray-800 sm:text-sm align-center"
          id="headlessui-listbox-button-:r0:"
          type="button"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={toggleDropdown}
          aria-labelledby="headlessui-listbox-label-:r1: headlessui-listbox-button-:r0:"
                        style={{cursor:"pointer"}}

        >
          <span className="inline-flex w-full truncate">
            <span
              className="flex h-6 items-center gap-1 truncate text-white"
              style={{ fontWeight: "bold", fontSize: "18px" }}
            >
              {selectedModdel}
            </span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <BsChevronDown className="h-4 w-4 text-gray-400" />
          </span>
        </button>
        {isOpen && (
          <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-800">
            <ul
              tabIndex={-1}
              role="listbox"
              aria-labelledby="headlessui-listbox-label-:r1: headlessui-listbox-button-:r0:"
              aria-activedescendant="headlessui-listbox-option-0-0"
              className="max-h-60 overflow-auto focus:outline-none sm:text-sm ring-1 ring-black ring-opacity-5"
            >
              {moddels.map((moddel, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectModel(moddel)}
                  id={`headlessui-listbox-option-${index}-0`}
                  role="option"
                  className="text-gray-900 dark:text-white cursor-default select-none relative py-2 pl-3 pr-9"
                >
                  <span className="font-normal block truncate">{moddel}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
                  {/* <SiOpenai className="h-8 w-8" /> */}
                  <h1 className="text-2xl sm:text-4xl font-semibold text-center text-gray-200 dark:text-gray-600 flex gap-2 items-center justify-center h-screen" style={{fontWeight:"bold"}}>
                    How can I help you today?
                  </h1>
                </div>
              ) : null}
              <div className="flex flex-col items-center text-sm dark:bg-gray-800"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
          <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
            <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
              {errorMessage ? (
                <div className="mb-2 md:mb-0">
                  <div className="h-full flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
                    <span className="text-red-500 text-sm">{errorMessage}</span>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]" style={{borderRadius:"15px"}}>
                <textarea
                  ref={textAreaRef}
                  value={message}
                  tabIndex={0}
                  data-id="root"
                  style={{
                    height: "24px",
                    maxHeight: "200px",
                    overflowY: "hidden",
                  }}
                  placeholder="Message ChatGPT..."
                  className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeypress}
                ></textarea>
                <button
                  disabled={isLoading || message?.length === 0}
                  onClick={sendMessage}
                  className="absolute p-1 rounded-md bottom-1.5 md:bottom-2.5 bg-transparent disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40"
                >
                  <FiSend className="h-4 w-4 mr-1 text-white " />
                </button>
              </div>
            </div>
          </form>
          <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
            <span>
            ChatGPT can make mistakes. Consider checking important information.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;


