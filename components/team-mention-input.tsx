"use client"

import * as React from "react"
import { IconAt, IconX, IconUser } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Sample team members - in a real app, this would come from a database or API
const SAMPLE_TEAM_MEMBERS = [
  { id: "1", name: "John Doe", email: "john@example.com", avatar: null },
  { id: "2", name: "Jane Smith", email: "jane@example.com", avatar: null },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", avatar: null },
  { id: "4", name: "Sarah Williams", email: "sarah@example.com", avatar: null },
  { id: "5", name: "David Brown", email: "david@example.com", avatar: null },
]

export type TeamMember = {
  id: string
  name: string
  email: string
  avatar?: string | null
}

interface TeamMentionInputProps {
  value: string // JSON string of selected team members
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  teamMembers?: TeamMember[] // Optional: pass custom team members
  className?: string
}

export function TeamMentionInput({
  value,
  onChange,
  label,
  placeholder = "Type @ to mention team members",
  teamMembers = SAMPLE_TEAM_MEMBERS,
  className,
}: TeamMentionInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Parse selected team members from JSON string
  const selectedMembers = React.useMemo(() => {
    if (!value) return []
    try {
      return JSON.parse(value) as TeamMember[]
    } catch {
      // Fallback: if it's a comma-separated string, try to parse it
      if (value.includes(",")) {
        return value.split(",").map((name) => ({
          id: name.trim(),
          name: name.trim(),
          email: "",
          avatar: null,
        }))
      }
      return []
    }
  }, [value])

  // Filter team members based on search query
  const filteredMembers = React.useMemo(() => {
    if (!searchQuery) return teamMembers
    const query = searchQuery.toLowerCase()
    return teamMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
    )
  }, [teamMembers, searchQuery])

  // Check if a member is already selected
  const isMemberSelected = (memberId: string) => {
    return selectedMembers.some((m) => m.id === memberId)
  }

  // Handle @ key press
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Check if @ was typed
    if (newValue.endsWith("@") && !newValue.endsWith("@@")) {
      setIsPopoverOpen(true)
      setSearchQuery("")
      // Focus the popover input after a short delay
      setTimeout(() => {
        const popoverInput = document.querySelector(
          '[data-popover-input]'
        ) as HTMLInputElement
        if (popoverInput) {
          popoverInput.focus()
        }
      }, 100)
    } else if (newValue.includes("@")) {
      // Extract search query after @
      const atIndex = newValue.lastIndexOf("@")
      if (atIndex !== -1) {
        const query = newValue.substring(atIndex + 1)
        setSearchQuery(query)
        setIsPopoverOpen(true)
      }
    } else {
      setIsPopoverOpen(false)
    }
  }

  // Handle member selection
  const handleSelectMember = (member: TeamMember) => {
    if (isMemberSelected(member.id)) {
      // Remove member if already selected
      const updated = selectedMembers.filter((m) => m.id !== member.id)
      onChange(JSON.stringify(updated))
    } else {
      // Add member
      const updated = [...selectedMembers, member]
      onChange(JSON.stringify(updated))
    }

    // Clear input and close popover
    setInputValue("")
    setSearchQuery("")
    setIsPopoverOpen(false)
    inputRef.current?.focus()
  }

  // Remove selected member
  const handleRemoveMember = (memberId: string) => {
    const updated = selectedMembers.filter((m) => m.id !== memberId)
    onChange(JSON.stringify(updated))
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-semibold flex items-center gap-2">
          <IconUser className="h-4 w-4" />
          {label}
        </Label>
      )}
      
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <IconAt className="h-4 w-4" />
          </div>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="pl-9 h-10"
          />
        </div>

        {/* Selected Members Display */}
        {selectedMembers.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/30">
            {selectedMembers.map((member) => (
              <Badge
                key={member.id}
                variant="secondary"
                className="flex items-center gap-2 px-2 py-1 pr-1"
              >
                <Avatar className="h-5 w-5">
                  {member.avatar && (
                    <AvatarImage src={member.avatar} alt={member.name} />
                  )}
                  <AvatarFallback className="text-[10px]">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">{member.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member.id)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                >
                  <IconX className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Popover for member selection */}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="hidden" />
          </PopoverTrigger>
          <PopoverContent
            className="w-[300px] p-0"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="p-2">
              <Input
                data-popover-input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 mb-2"
                autoFocus
              />
              <div className="max-h-[200px] overflow-y-auto">
                {filteredMembers.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No team members found
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredMembers.map((member) => {
                      const isSelected = isMemberSelected(member.id)
                      return (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => handleSelectMember(member)}
                          className={cn(
                            "w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors text-left",
                            isSelected && "bg-muted"
                          )}
                        >
                          <Avatar className="h-8 w-8">
                            {member.avatar && (
                              <AvatarImage src={member.avatar} alt={member.name} />
                            )}
                            <AvatarFallback className="text-xs">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {member.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {member.email}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="text-primary">
                              <IconX className="h-4 w-4" />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
