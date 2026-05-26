"use client";

import { useEffect, useRef, useState } from "react";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { plainTextToHtml } from "@/lib/posts";

type RichTextEditorProps = {
  value: string;
  legacyText?: string;
  disabled?: boolean;
  onChange: (html: string, text: string) => void;
  onError?: (message: string) => void;
};

type UploadedImage = { url: string };

async function readError(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => null);
  return typeof body?.error === "string" ? body.error : fallback;
}

function initialContent(value: string, legacyText?: string): string {
  if (value.trim()) return value;
  return legacyText?.trim() ? plainTextToHtml(legacyText) : "";
}

export function RichTextEditor({ value, legacyText, disabled, onChange, onError }: RichTextEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        autolink: true,
        openOnClick: false,
      }),
      Image,
    ],
    content: initialContent(value, legacyText),
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getText());
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) return;
    const next = initialContent(value, legacyText);
    if (next !== editor.getHTML()) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, legacyText, value]);

  async function uploadInlineImage(file: File) {
    if (!editor) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "blog");

      const res = await fetch("/api/uploads", { method: "POST", body: form });
      if (!res.ok) {
        throw new Error(await readError(res, "Image upload failed."));
      }

      const uploaded = (await res.json()) as UploadedImage;
      editor.chain().focus().setImage({ src: uploaded.url, alt: file.name }).run();
      onChange(editor.getHTML(), editor.getText());
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
      setUploading(false);
    }
  }

  function setLink() {
    if (!editor) return;
    const current = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Paste the link URL", current ?? "");
    if (href === null) return;
    if (!href.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  }

  if (!editor) return null;

  return (
    <div className="rich-editor">
      <div className="rich-toolbar" aria-label="Blog formatting tools">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "active" : ""} disabled={disabled}>
          Bold
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "active" : ""} disabled={disabled}>
          Italic
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? "active" : ""} disabled={disabled}>
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive("heading", { level: 3 }) ? "active" : ""} disabled={disabled}>
          H3
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "active" : ""} disabled={disabled}>
          List
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "active" : ""} disabled={disabled}>
          1. List
        </button>
        <button type="button" onClick={setLink} className={editor.isActive("link") ? "active" : ""} disabled={disabled}>
          Link
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={disabled || uploading}>
          {uploading ? "Uploading" : "Image"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) uploadInlineImage(file);
          }}
        />
      </div>
      <EditorContent editor={editor} className="rich-content rich-editor-content" />
    </div>
  );
}
