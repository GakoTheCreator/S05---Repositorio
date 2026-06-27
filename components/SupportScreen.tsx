"use client";

import { FormEvent, useRef, useState } from "react";
import { ArrowLeft, Bot, CheckCheck, Paperclip, Send, Sparkles } from "lucide-react";

type Message = { id: number; author: "assistant" | "user"; text: string; time: string };

type SupportScreenProps = { onBack: () => void };

const initialMessages: Message[] = [
  { id: 1, author: "assistant", text: "Olá, Gabriel! Sou a assistente virtual do Inatel. Como posso ajudar hoje?", time: "14:28" },
  { id: 2, author: "user", text: "Quero saber como atualizar meu currículo para uma vaga.", time: "14:29" },
  { id: 3, author: "assistant", text: "Claro! Acesse Perfil › Currículo. Você pode substituir o PDF atual antes de enviar uma candidatura.", time: "14:29" },
];

export function SupportScreen({ onBack }: SupportScreenProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  const nextId = useRef(4);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: nextId.current++, author: "user", text, time: "Agora" }]);
    setValue("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, {
        id: nextId.current++,
        author: "assistant",
        text: "Entendi. Para esta demonstração, registrei sua solicitação. Um atendente poderá continuar o contato pelo e-mail acadêmico.",
        time: "Agora",
      }]);
      setTyping(false);
    }, 750);
  }

  return (
    <div className="support-screen page-enter">
      <header className="support-header">
        <button className="icon-button" onClick={onBack} aria-label="Voltar"><ArrowLeft size={22} /></button>
        <span className="support-avatar"><Bot size={22} /></span>
        <div><h1>Atendente virtual</h1><span><i /> Online agora</span></div>
      </header>

      <div className="chat-area">
        <div className="chat-date">Hoje</div>
        {messages.map((message) => (
          <div className={`message-row message-row--${message.author}`} key={message.id}>
            {message.author === "assistant" ? <span className="message-bot"><Sparkles size={15} /></span> : null}
            <div className="message-bubble"><p>{message.text}</p><small>{message.time} {message.author === "user" ? <CheckCheck size={13} /> : null}</small></div>
          </div>
        ))}
        {typing ? <div className="message-row message-row--assistant"><span className="message-bot"><Sparkles size={15} /></span><div className="typing-bubble"><span /><span /><span /></div></div> : null}
      </div>

      <form className="chat-composer" onSubmit={submit}>
        <button type="button" className="icon-button" aria-label="Anexar arquivo"><Paperclip size={21} /></button>
        <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Digite sua mensagem..." aria-label="Digite sua mensagem" />
        <button className="chat-send" type="submit" aria-label="Enviar mensagem"><Send size={19} /></button>
      </form>
    </div>
  );
}
