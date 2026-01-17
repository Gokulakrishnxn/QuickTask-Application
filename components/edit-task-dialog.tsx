"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { IconCalendar, IconClock, IconFolder } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { type Task } from "@/components/tasks-table"
import { toast } from "sonner"
import { useProjects } from "@/hooks/use-projects"

const statuses = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "canceled", label: "Canceled" },
]

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

interface EditTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskUpdate?: (id: string, updates: Partial<Task>) => Promise<void>
}

export function EditTaskDialog({ task, open, onOpenChange, onTaskUpdate }: EditTaskDialogProps) {
  const { projects, loading: projectsLoading } = useProjects()
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [status, setStatus] = React.useState<Task["status"]>("todo")
  const [priority, setPriority] = React.useState<Task["priority"]>("medium")
  const [projectId, setProjectId] = React.useState<string>("")
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [deadline, setDeadline] = React.useState<Date | undefined>(undefined)
  const [reminder, setReminder] = React.useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Update form when task changes
  React.useEffect(() => {
    if (task && open) {
      setTitle(task.title)
      setDescription(task.description || "")
      setStatus(task.status)
      setPriority(task.priority)
      setProjectId(task.project_id || "")
      setDate(task.date ? parseISO(task.date) : undefined)
      setDeadline(task.deadline ? parseISO(task.deadline) : undefined)
      setReminder(task.reminder ? parseISO(task.reminder) : undefined)
    }
  }, [task, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!task || !title.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      if (onTaskUpdate) {
        await onTaskUpdate(task.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          project_id: projectId || undefined,
          date: date ? format(date, "yyyy-MM-dd") : undefined,
          deadline: deadline ? format(deadline, "yyyy-MM-dd") : undefined,
          reminder: reminder ? reminder.toISOString() : undefined,
        })
      }

      toast.success("Task updated successfully", {
        description: `"${title.trim()}" has been updated.`,
        duration: 3000,
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to update task", {
        description: error instanceof Error ? error.message : "Please try again.",
        duration: 4000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-semibold">Edit Task</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Update the task details below. All fields except title are optional.
            </DialogDescription>
          </DialogHeader>
          <div className={`space-y-6 py-2 ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}>
            {/* Task Title - Required */}
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-sm font-semibold">
                Task Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-title"
                placeholder="e.g., Complete project documentation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-10"
              />
            </div>

            {/* Task Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-sm font-semibold">
                Task Description
              </Label>
              <Textarea
                id="edit-description"
                placeholder="Add a detailed description of the task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Project Name - Select Project */}
            <div className="space-y-2">
              <Label htmlFor="edit-project" className="text-sm font-semibold flex items-center gap-2">
                <IconFolder className="h-4 w-4" />
                Project Name
              </Label>
              <Select
                value={projectId || "none"}
                onValueChange={(value) => setProjectId(value === "none" ? "" : value)}
                disabled={projectsLoading}
              >
                <SelectTrigger id="edit-project" className="h-10">
                  <SelectValue placeholder={projectsLoading ? "Loading projects..." : "Select a project (optional)"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Project</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status and Priority - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-sm font-semibold">
                  Status
                </Label>
                <Select value={status} onValueChange={(value) => setStatus(value as Task["status"])}>
                  <SelectTrigger id="edit-status" className="h-10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority" className="text-sm font-semibold">
                  Priority
                </Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as Task["priority"])}
                >
                  <SelectTrigger id="edit-priority" className="h-10">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date and Deadline - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date" className="text-sm font-semibold">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="edit-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <IconCalendar className="mr-2 h-4 w-4" />
                      {date ? format(date, "MMM d, yyyy") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-deadline" className="text-sm font-semibold">
                  Deadline
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="edit-deadline"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10",
                        !deadline && "text-muted-foreground"
                      )}
                    >
                      <IconCalendar className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, "MMM d, yyyy") : <span>Select deadline</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Reminder */}
            <div className="space-y-2">
              <Label htmlFor="edit-reminder" className="text-sm font-semibold">
                Reminder
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="edit-reminder"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10",
                      !reminder && "text-muted-foreground"
                    )}
                  >
                    <IconClock className="mr-2 h-4 w-4" />
                    {reminder ? format(reminder, "MMM d, yyyy 'at' h:mm a") : <span>Set reminder</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3">
                    <Calendar
                      mode="single"
                      selected={reminder}
                      onSelect={(date) => {
                        if (date) {
                          const newDate = new Date(date)
                          if (reminder) {
                            newDate.setHours(reminder.getHours(), reminder.getMinutes())
                          } else {
                            newDate.setHours(9, 0)
                          }
                          setReminder(newDate)
                        } else {
                          setReminder(undefined)
                        }
                      }}
                      initialFocus
                    />
                    {reminder && (
                      <div className="mt-3 pt-3 border-t">
                        <Label htmlFor="edit-reminder-time" className="text-sm font-medium mb-2 block">
                          Time
                        </Label>
                        <Input
                          id="edit-reminder-time"
                          type="time"
                          value={reminder ? format(reminder, "HH:mm") : ""}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(":")
                            if (reminder && hours && minutes) {
                              const newReminder = new Date(reminder)
                              newReminder.setHours(parseInt(hours), parseInt(minutes))
                              setReminder(newReminder)
                            } else if (hours && minutes) {
                              const newReminder = new Date()
                              newReminder.setHours(parseInt(hours), parseInt(minutes))
                              setReminder(newReminder)
                            }
                          }}
                          className="w-full h-9"
                        />
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter className="gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="sm:min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="sm:min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Updating...</span>
                </>
              ) : (
                "Update Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
