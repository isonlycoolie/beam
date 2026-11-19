"use client";

import { Add01Icon, Cancel01Icon, File01Icon, Image01Icon } from "@hugeicons/core-free-icons";
import * as React from "react";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from "@beam/ui/components/attachment";
import { Composer, ComposerAction, ComposerAttachments, ComposerFooter, ComposerInput, ComposerSubmit } from "@beam/ui/components/composer";
import { Icon } from "@beam/ui/icons";

const FILES = [
  { name: "brief.pdf", size: "84 KB", icon: File01Icon },
  { name: "homepage.png", size: "1.2 MB", icon: Image01Icon },
];

export default function ComposerAttachmentsExample() {
  const [files, setFiles] = React.useState(FILES);
  return (
    <Composer className="w-[520px]" hasAttachments={files.length > 0}>
      <ComposerAttachments>
        {files.map((file) => (
          <Attachment key={file.name} size="sm" className="w-full">
            <AttachmentMedia>
              <Icon icon={file.icon} size="sm" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{file.name}</AttachmentTitle>
              <AttachmentDescription>{file.size}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label={`Remove ${file.name}`} onClick={() => setFiles((all) => all.filter((f) => f !== file))}>
                <Icon icon={Cancel01Icon} size="sm" />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        ))}
      </ComposerAttachments>
      <ComposerInput placeholder="Say what to do with the files" />
      <ComposerFooter>
        <ComposerAction aria-label="Add files">
          <Icon icon={Add01Icon} size="sm" />
        </ComposerAction>
        <ComposerSubmit className="ms-auto" />
      </ComposerFooter>
    </Composer>
  );
}
