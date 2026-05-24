import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card"
import { cn } from "@/lib/utils"

interface WorkItemProps {
  title: string
  date: string
  description: string
  technologies?: string[]
  href?: string
  image?: string
  dataEvent?: string
}

function imageSrc(image: string) {
  return image.startsWith("/") ? image : `/${image}`
}

function WorkItemContent({
  title,
  date,
  description,
  technologies,
  href,
  linkedTitle = false,
  dataEvent,
}: WorkItemProps & { linkedTitle?: boolean }) {
  const titleElement =
    linkedTitle && href ? (
      <span className="shrink-0 font-medium">{title}</span>
    ) : href ? (
      <a data-event={dataEvent} href={href} className="shrink-0 font-medium hover:underline">
        {title}
      </a>
    ) : (
      <span className="shrink-0 font-medium">{title}</span>
    )

  return (
    <div className="flex w-full min-w-0 flex-col gap-1">
      <div className="flex min-w-0 items-baseline gap-x-2">
        {titleElement}
        <span className="shrink-0 text-muted-foreground"> — </span>
        <span className="min-w-0 flex-1 text-muted-foreground">{description}</span>
        <span className="shrink-0 pl-4 tabular-nums text-muted-foreground/60">
          {date}
        </span>
      </div>
      {technologies && technologies.length > 0 ? (
        <p className="text-muted-foreground/60">{technologies.join(" · ")}</p>
      ) : null}
    </div>
  )
}

export function WorkItem({
  title,
  date,
  description,
  technologies,
  href,
  image,
}: WorkItemProps) {
  const contentClassName = "block w-full min-w-0 py-3 text-sm"

  const content = (
    <WorkItemContent
      title={title}
      date={date}
      description={description}
      technologies={technologies}
      href={href}
      linkedTitle={Boolean(href && image)}
    />
  )

  if (!image) {
    return (
      <li className="border-b border-border">
        <div className={contentClassName}>{content}</div>
      </li>
    )
  }

  return (
    <li className="border-b border-border">
      <HoverCard>
        {href ? (
          <HoverCardTrigger
            delay={200}
            closeDelay={100}
            href={href}
            className={cn(
              contentClassName,
              "text-foreground no-underline hover:no-underline"
            )}
          >
            {content}
          </HoverCardTrigger>
        ) : (
          <HoverCardTrigger
            delay={200}
            closeDelay={100}
            render={
              <span className={cn(contentClassName, "cursor-default")} />
            }
          >
            {content}
          </HoverCardTrigger>
        )}
        <HoverCardContent side="top" sideOffset={8} className="w-auto p-1">
          <img
            src={imageSrc(image)}
            alt={title}
            width={280}
            height={175}
            className="rounded-md object-cover"
          />
        </HoverCardContent>
      </HoverCard>
    </li>
  )
}
