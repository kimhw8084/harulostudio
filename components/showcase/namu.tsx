"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShowcaseFoot, ShowcaseShell } from "./shared";

type Note = { id: string; title: string; body: string };
const initial: Note[] = [
  { id: "today", title: "A walk", body: "A thought. A beginning." },
  { id: "reference", title: "A useful reference", body: "Keep the small details close." },
];
const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase();

export function NamuSpecimen() {
  const [notes, setNotes] = useState<Note[]>(initial);
  const [selected, setSelected] = useState("today");
  const [notice, setNotice] = useState("");
  const nextId = useRef(0);
  const [query, setQuery] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [links, setLinks] = useState<Record<string, string>>({});
  const composing = useRef(false);
  const current = notes.find((note) => note.id === selected);
  const visible = useMemo(() => {
    const q = normalize(query.trim());
    return notes.filter((note) => !q || normalize(`${note.title} ${note.body}`).includes(q));
  }, [notes, query]);
  const updateCurrent = (field: "title" | "body", value: string) => {
    setNotes((items) => items.map((note) => note.id === selected ? { ...note, [field]: value } : note));
  };
  const create = () => {
    if (!draftTitle.trim() && !draftBody.trim()) return;
    if (notes.length >= 8) {
      setNotice("This showcase keeps up to 8 notes.");
      return;
    }
    const id = `note-${nextId.current++}`;
    const note = { id, title: draftTitle.trim() || "Untitled", body: draftBody.trim() };
    setNotes((items) => [...items, note]);
    setSelected(id);
    setDraftTitle("");
    setDraftBody("");
    setNotice("");
  };
  const remove = () => {
    if (!current) return;
    const next = notes.filter((note) => note.id !== current.id);
    setNotes(next);
    setSelected(next[0]?.id ?? "");
    setLinks((value) => Object.fromEntries(Object.entries(value).filter(([from, to]) => from !== current.id && to !== current.id)));
  };
  const reset = () => {
    setNotes(initial);
    setSelected("today");
    setQuery("");
    setDraftTitle("");
    setDraftBody("");
    setLinks({});
    setNotice("");
    nextId.current = 0;
  };
  const exportMarkdown = () => {
    const markdown = notes.map((note) => `## ${note.title}\n\n${note.body}`).join("\n\n");
    const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "namu-showcase-notes.md";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return (
    <ShowcaseShell name="Namu">
      <div className="showcase-split">
        <div>
          <label className="concept-label" htmlFor="namu-search">Search notes</label>
          <Input id="namu-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title or body" />
          <ul className="specimen-items" aria-label="Namu note list">
            {visible.map((note) => <li key={note.id}><button type="button" className={note.id === selected ? "is-selected" : ""} onClick={() => setSelected(note.id)}>{note.title}</button></li>)}
          </ul>
          <p className="metadata">{visible.length} of {notes.length} notes · limit 8</p>
        </div>
        <div>
          {current ? <>
            <label className="concept-label" htmlFor="namu-title">Selected note</label>
            <Input id="namu-title" value={current.title} onChange={(event) => updateCurrent("title", event.target.value)} />
            <Textarea id="namu-body" aria-label="Selected note body" value={current.body} onChange={(event) => updateCurrent("body", event.target.value)} maxLength={1600} />
            <div className="instrument-actions">
              <label className="concept-label" htmlFor="namu-link">Link to</label>
              <select id="namu-link" value={links[current.id] ?? ""} onChange={(event) => setLinks((value) => ({ ...value, [current.id]: event.target.value }))}>
                <option value="">No linked note</option>
                {notes.filter((note) => note.id !== current.id).map((note) => <option key={note.id} value={note.id}>{note.title}</option>)}
              </select>
              {links[current.id] && <p className="metadata">Linked by ID to {notes.find((note) => note.id === links[current.id])?.title ?? "deleted note"}.</p>}
              <Button type="button" variant="ghost" onClick={remove}>Delete selected</Button>
            </div>
          </> : <p className="empty-publication">No notes yet. Create a first thought.</p>}
        </div>
      </div>
      <div className="instrument-actions">
        <Input aria-label="New note title" placeholder="New note title" value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} onCompositionStart={() => { composing.current = true; }} onCompositionEnd={() => { composing.current = false; }} onKeyDown={(event) => { if (event.key === "Enter" && !composing.current) create(); }} />
        <Textarea aria-label="New note body" placeholder="A note in progress" value={draftBody} onChange={(event) => setDraftBody(event.target.value)} maxLength={1600} />
        <Button type="button" onClick={create}>Create note</Button>
        <Button type="button" variant="ghost" onClick={exportMarkdown}>Export Markdown</Button>
      </div>
      <p className="metadata" role="status" aria-live="polite">{notice}</p>
      <ShowcaseFoot onReset={reset} />
    </ShowcaseShell>
  );
}
