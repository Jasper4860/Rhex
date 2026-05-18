"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import {
  SettingsInputField,
  SettingsSection,
  SettingsToggleField,
} from "@/components/admin/admin-settings-fields"
import { Button } from "@/components/ui/button"
import { saveAdminSiteSettings } from "@/lib/admin-site-settings-client"
import { DEFAULT_MESSAGE_PROMPT_AUDIO_PATH } from "@/lib/message-prompt-audio"

interface AdminMessageSettingsFormProps {
  initialSettings: {
    messageEnabled: boolean
    messageImageUploadEnabled: boolean
    messageFileUploadEnabled: boolean
    messagePromptAudioPath: string
  }
}

export function AdminMessageSettingsForm({ initialSettings }: AdminMessageSettingsFormProps) {
  const router = useRouter()
  const [messageEnabled, setMessageEnabled] = useState(Boolean(initialSettings.messageEnabled))
  const [messageImageUploadEnabled, setMessageImageUploadEnabled] = useState(Boolean(initialSettings.messageImageUploadEnabled))
  const [messageFileUploadEnabled, setMessageFileUploadEnabled] = useState(Boolean(initialSettings.messageFileUploadEnabled))
  const [messagePromptAudioPath, setMessagePromptAudioPath] = useState(initialSettings.messagePromptAudioPath || DEFAULT_MESSAGE_PROMPT_AUDIO_PATH)
  const [feedback, setFeedback] = useState("")
  const [isPending, startTransition] = useTransition()

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        setFeedback("")
        startTransition(async () => {
          const result = await saveAdminSiteSettings({
            messageEnabled,
            messageImageUploadEnabled,
            messageFileUploadEnabled,
            messagePromptAudioPath,
            section: "site-messages",
          })
          setFeedback(result.message)
          if (result.ok) {
            router.refresh()
          }
        })
      }}
    >
      <SettingsSection
        title="私信配置"
        description="集中管理私信上传能力和新消息提示音。全站聊天室入口请到“社区互动 / 全站聊天室”配置。"
        className="border-none shadow-none ring-0"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SettingsToggleField label="私信功能" checked={messageEnabled} onChange={setMessageEnabled} description="关闭后，前台会隐藏所有私信入口，并禁止访问私信页、发送与上传私信内容。" />
          <SettingsToggleField label="私信图片发送" checked={messageImageUploadEnabled} onChange={setMessageImageUploadEnabled} description="开启后，私信输入框支持上传和粘贴发送图片，并以内嵌图片消息展示。" />
          <SettingsToggleField label="私信文件发送" checked={messageFileUploadEnabled} onChange={setMessageFileUploadEnabled} description="开启后，私信支持上传文件，并以 file::FILENAME:FILEURL 的专用消息卡片展示。" />
          <SettingsInputField
            label="消息提示音 URL"
            value={messagePromptAudioPath}
            onChange={setMessagePromptAudioPath}
            placeholder={DEFAULT_MESSAGE_PROMPT_AUDIO_PATH}
            description="留空会回退到默认提示音 /apps/messages/prompt.mp3。可填写站内静态资源路径，也可填写完整音频 URL。"
            className="md:col-span-2 xl:col-span-2"
          />
        </div>
        <p className="text-xs leading-6 text-muted-foreground">
          私信图片会复用站点图片上传规则；私信文件会复用“上传 / 附件配置”中的附件格式和大小限制，并沿用同一套存储策略。
        </p>
      </SettingsSection>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending} size="lg" className="rounded-full px-4 text-xs">{isPending ? "保存中..." : "保存私信配置"}</Button>
        {feedback ? <span className="text-sm text-muted-foreground">{feedback}</span> : null}
      </div>
    </form>
  )
}
