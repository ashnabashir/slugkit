import { LinkIcon, RotateCcwIcon, SparklesIcon, TerminalIcon } from "lucide-react"
import { useId, useMemo, useState } from "react"

import { CopyButton } from "@/components/copy-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCopy } from "@/hooks/use-copy"
import { cn } from "@/lib/utils"
import { slugify } from "@/lib/slugify"

const EXAMPLE_TEXT = [
  "Café au lait: 10 recipes you'll love!",
  "Ünïcödé Headlines — Made Simple",
  "   Spaces, punctuation & symbols?!   ",
  "Q3 2026 Product Update (Final v2)",
].join("\n")

const SEPARATOR_PRESETS = ["-", "_", "."]

function parseMaxLength(raw: string): { value: number | null; error: string | null } {
  if (raw.trim() === "") return { value: null, error: null }
  const value = Number(raw)
  if (!Number.isInteger(value) || value < 1) {
    return { value: null, error: "Use a whole number of 1 or more, or leave it blank." }
  }
  return { value, error: null }
}

function shellQuote(value: string) {
  return `'${value.replace(/'/g, `'\\''`)}'`
}

function pythonSnippet(text: string, separator: string, maxLength: number | null) {
  const args = [JSON.stringify(text)]
  if (separator !== "-") args.push(`separator=${JSON.stringify(separator)}`)
  if (maxLength !== null) args.push(`max_length=${maxLength}`)
  return `from slugkit import slugify\n\nslugify(${args.join(", ")})`
}

function cliSnippet(text: string, separator: string, maxLength: number | null) {
  const parts = ["slugkit"]
  if (separator !== "-") parts.push(`--separator=${shellQuote(separator)}`)
  if (maxLength !== null) parts.push(`--max-length=${maxLength}`)
  if (text.startsWith("-")) parts.push("--")
  parts.push(shellQuote(text))
  return parts.join(" ")
}

export default function App() {
  const ids = { text: useId(), separator: useId(), maxLength: useId() }
  const [text, setText] = useState(EXAMPLE_TEXT)
  const [separator, setSeparator] = useState("-")
  const [maxLengthRaw, setMaxLengthRaw] = useState("")
  const { copy, statusFor } = useCopy()

  const maxLength = parseMaxLength(maxLengthRaw)
  const separatorError = separator === "" ? "Enter at least one character." : null
  const hasError = Boolean(separatorError || maxLength.error)

  const lines = useMemo(() => text.split(/\r?\n/).filter((line) => line.trim() !== ""), [text])
  const results = useMemo(() => {
    if (hasError) return []
    return lines.map((line) => ({ line, slug: slugify(line, { separator, maxLength: maxLength.value }) }))
  }, [hasError, lines, separator, maxLength.value])

  const allSlugs = results.map((r) => r.slug).filter(Boolean).join("\n")
  const firstLine = lines[0] ?? "Hello, World!"

  return (
    <div className="min-h-svh bg-gradient-to-b from-neutral-50 to-white text-foreground">
      <header className="mx-auto flex max-w-6xl items-center gap-2 px-4 pt-8 sm:px-6">
        <span className="grid size-8 place-items-center rounded-lg bg-neutral-900 text-white">
          <LinkIcon className="size-4" />
        </span>
        <span className="font-semibold tracking-tight">Slug Playground</span>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <section className="py-10 sm:py-14">
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            Turn any title into a clean, URL-safe slug.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Paste one title per line. Accents are flattened, punctuation is dropped, and every line
            becomes a lowercase slug, exactly as the <code className="font-mono text-sm">slugkit</code>{" "}
            Python library produces it.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your text</CardTitle>
              <CardDescription>Each non-empty line becomes its own slug.</CardDescription>
              <CardAction className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setText(EXAMPLE_TEXT)}>
                  <SparklesIcon /> Examples
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setText("")} disabled={!text}>
                  <RotateCcwIcon /> Clear
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor={ids.text} className="sr-only">
                  Text to slugify
                </Label>
                <Textarea
                  id={ids.text}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste titles here, one per line"
                  className="min-h-44 font-mono text-sm"
                  spellCheck={false}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={ids.separator}>Separator</Label>
                  <div className="flex gap-2">
                    <Input
                      id={ids.separator}
                      value={separator}
                      onChange={(e) => setSeparator(e.target.value)}
                      aria-invalid={Boolean(separatorError)}
                      aria-describedby={separatorError ? `${ids.separator}-error` : undefined}
                      className="w-16 text-center font-mono"
                      maxLength={5}
                    />
                    <div className="flex gap-1" role="group" aria-label="Separator presets">
                      {SEPARATOR_PRESETS.map((preset) => (
                        <Button
                          key={preset}
                          type="button"
                          variant={preset === separator ? "secondary" : "outline"}
                          size="icon"
                          className="font-mono"
                          onClick={() => setSeparator(preset)}
                          aria-pressed={preset === separator}
                        >
                          {preset}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {separatorError && (
                    <p id={`${ids.separator}-error`} className="text-sm text-destructive">
                      {separatorError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={ids.maxLength}>Max length</Label>
                  <Input
                    id={ids.maxLength}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={maxLengthRaw}
                    onChange={(e) => setMaxLengthRaw(e.target.value)}
                    placeholder="No limit"
                    aria-invalid={Boolean(maxLength.error)}
                    aria-describedby={maxLength.error ? `${ids.maxLength}-error` : undefined}
                  />
                  {maxLength.error && (
                    <p id={`${ids.maxLength}-error`} className="text-sm text-destructive">
                      {maxLength.error}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Slugs
                {results.length > 0 && <Badge variant="secondary">{results.length}</Badge>}
              </CardTitle>
              <CardDescription>Updates as you type. Copy one or all of them.</CardDescription>
              <CardAction>
                <CopyButton
                  showText
                  label="all slugs"
                  status={statusFor("all")}
                  onCopy={() => copy("all", allSlugs)}
                  disabled={!allSlugs}
                />
              </CardAction>
            </CardHeader>
            <CardContent>
              {hasError ? (
                <EmptyState title="Fix the options to see slugs" body="Check the highlighted field on the left." />
              ) : results.length === 0 ? (
                <EmptyState title="Nothing to slugify yet" body="Type a title on the left, or load the examples." />
              ) : (
                <ul className="divide-y rounded-lg border">
                  {results.map(({ line, slug }, index) => {
                    const key = `slug-${index}`
                    return (
                      <li key={key} className="flex items-center gap-3 px-3 py-2.5">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs text-muted-foreground" title={line}>
                            {line}
                          </p>
                          {slug ? (
                            <p className="font-mono text-sm break-all">{slug}</p>
                          ) : (
                            <p className="text-sm text-amber-700">No letters or digits to keep.</p>
                          )}
                        </div>
                        <Badge variant="outline" className={cn("tabular-nums", !slug && "invisible")}>
                          {slug.length}
                        </Badge>
                        <CopyButton
                          label={slug}
                          status={statusFor(key)}
                          onCopy={() => copy(key, slug)}
                          disabled={!slug}
                        />
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TerminalIcon className="size-4" /> Same result in Python
            </CardTitle>
            <CardDescription>
              These snippets use your first line and current options.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <Snippet
              title="Library"
              code={pythonSnippet(firstLine, separator || "-", maxLength.value)}
              status={statusFor("python")}
              onCopy={(code) => copy("python", code)}
            />
            <Snippet
              title="Command line"
              code={cliSnippet(firstLine, separator || "-", maxLength.value)}
              status={statusFor("cli")}
              onCopy={(code) => copy("cli", code)}
            />
          </CardContent>
        </Card>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Powered by{" "}
        <a
          href="https://github.com/ashnabashir/slugkit"
          className="font-mono underline underline-offset-4 hover:text-foreground"
          target="_blank"
          rel="noreferrer"
        >
          slugkit
        </a>
        , an open-source Python library.
      </footer>
    </div>
  )
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="grid min-h-44 place-items-center rounded-lg border border-dashed p-6 text-center">
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}

function Snippet({
  title,
  code,
  status,
  onCopy,
}: {
  title: string
  code: string
  status: ReturnType<ReturnType<typeof useCopy>["statusFor"]>
  onCopy: (code: string) => void
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-neutral-950 text-neutral-100">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="text-xs text-neutral-400">{title}</span>
        <div className="text-neutral-200 [&_button:hover]:bg-white/10 [&_button:hover]:text-white">
          <CopyButton label={`${title} snippet`} status={status} onCopy={() => onCopy(code)} />
        </div>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}
