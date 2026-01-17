"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  IconX,
  IconMail,
  IconUser,
  IconCalendar,
  IconCircleCheck,
  IconClock,
} from "@tabler/icons-react"
import { format } from "date-fns"
import { type TeamMember } from "@/components/team-mention-input"

interface TeamMemberDetailSheetProps {
  member: TeamMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: string
  status?: string
  joinedAt?: Date
}

export function TeamMemberDetailSheet({
  member,
  open,
  onOpenChange,
  role = "Member",
  status = "active",
  joinedAt,
}: TeamMemberDetailSheetProps) {
  if (!member) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto p-0 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm border-b">
          <SheetHeader className="px-6 pt-6 pb-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="h-16 w-16 border-2 border-border">
                  {member.avatar && (
                    <AvatarImage src={member.avatar} alt={member.name} />
                  )}
                  <AvatarFallback className="text-lg">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <SheetTitle className="text-2xl font-bold leading-tight pr-8">
                    {member.name}
                  </SheetTitle>
                  {member.email && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {member.email}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 -mt-1 -mr-2 h-8 w-8"
                onClick={() => onOpenChange(false)}
              >
                <IconX className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {role}
              </Badge>
              <Badge
                variant={status === "active" ? "default" : status === "pending" ? "secondary" : "outline"}
                className="capitalize"
              >
                {status}
              </Badge>
            </div>
          </SheetHeader>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-6 space-y-6">
          {/* Contact Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <div className="p-1.5 rounded-md bg-primary/10">
                <IconMail className="h-4 w-4 text-primary" />
              </div>
              <span>Contact Information</span>
            </div>
            <div className="pl-9 space-y-3">
              {member.email && (
                <div className="flex items-center gap-3">
                  <IconMail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${member.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {member.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Member Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <div className="p-1.5 rounded-md bg-primary/10">
                <IconUser className="h-4 w-4 text-primary" />
              </div>
              <span>Member Details</span>
            </div>
            <div className="pl-9 space-y-2">
              <div className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50">
                <span className="text-xs font-medium text-muted-foreground">Role</span>
                <Badge variant="outline" className="capitalize">
                  {role}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50">
                <span className="text-xs font-medium text-muted-foreground">Status</span>
                <Badge
                  variant={status === "active" ? "default" : status === "pending" ? "secondary" : "outline"}
                  className="capitalize"
                >
                  {status}
                </Badge>
              </div>
              {joinedAt && (
                <div className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50">
                  <span className="text-xs font-medium text-muted-foreground">Joined</span>
                  <div className="flex items-center gap-2">
                    <IconCalendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-foreground">
                      {format(joinedAt, "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity Summary</CardTitle>
              <CardDescription>
                Recent activity and contributions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <IconCircleCheck className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">
                  Completed 12 tasks this month
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <IconClock className="h-4 w-4 text-blue-500" />
                <span className="text-muted-foreground">
                  In progress: 3 tasks
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
