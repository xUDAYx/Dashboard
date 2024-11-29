"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Permission {
  name: string
  description: string
}

interface PermissionFormProps {
  permission?: Permission
  onSubmit: (data: Permission) => void
  onClose?: () => void
}

export function PermissionForm({ permission, onSubmit, onClose }: PermissionFormProps) {
  const [formData, setFormData] = useState<Permission>(
    permission || {
      name: "",
      description: "",
    }
  )
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
    if (onClose) onClose()
    toast({
      title: permission ? "Permission Updated" : "Permission Added",
      description: `${formData.name} has been ${permission ? "updated" : "added"} successfully.`,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Permission Name
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Enter permission name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter permission description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        {permission ? "Update Permission" : "Add Permission"}
      </Button>
    </form>
  )
}
