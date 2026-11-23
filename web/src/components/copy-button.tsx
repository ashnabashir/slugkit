import { CheckIcon, CopyIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { CopyState } from "@/hooks/use-copy"

interface CopyButtonProps {
  status: CopyState
  onCopy: () => void
  label: string
  disabled?: boolean
  showText?: boolean
}

export function CopyButton({ status, onCopy, label, disabled, showText }: CopyButtonProps) {
  const Icon = status === "copied" ? CheckIcon : status === "failed" ? XIcon : CopyIcon
  const text = status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : "Copy"

  return (
    <Button
      type="button"
      variant={showText ? "outline" : "ghost"}
      size={showText ? "sm" : "icon-sm"}
      onClick={onCopy}
      disabled={disabled}
      aria-label={showText ? undefined : `${text}: ${label}`}
      title={showText ? undefined : text}
    >
      <Icon className={status === "copied" ? "text-emerald-600" : undefined} />
      {showText && text}
      <span className="sr-only" aria-live="polite">
        {status !== "idle" ? text : ""}
      </span>
    </Button>
  )
}
