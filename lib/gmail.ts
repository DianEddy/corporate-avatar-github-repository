import { getToken } from '@vercel/connect'
import { google } from 'googleapis'

const CONNECTOR_ID = 'scl_dxdFjPonSj6IA1GYpDgXww'
const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.compose']

export async function getGmailClient() {
  const accessToken = await getToken(CONNECTOR_ID, {
    subject: { type: 'app' },
    scopes: GMAIL_SCOPES,
  })
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  return google.gmail({ version: 'v1', auth })
}

export function decodeMessageBody(data?: string | null) {
  if (!data) return ''
  return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
}

export function findPlainTextPart(payload: { mimeType?: string | null; body?: { data?: string | null } | null; parts?: unknown[] } | undefined): string {
  if (!payload) return ''
  if (payload.mimeType === 'text/plain' && payload.body?.data) return decodeMessageBody(payload.body.data)
  for (const part of payload.parts ?? []) {
    const text = findPlainTextPart(part as typeof payload)
    if (text) return text
  }
  return ''
}

export function headerValue(headers: { name?: string | null; value?: string | null }[] | undefined, name: string) {
  return headers?.find((header) => header.name?.toLowerCase() === name.toLowerCase())?.value ?? ''
}

export function encodeBase64Url(value: string) {
  return Buffer.from(value).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export { GMAIL_SCOPES }

export function createDraftRaw({ to, subject, body }: { to: string; subject: string; body: string }) {
  return encodeBase64Url([`To: ${to}`, `Subject: ${subject}`, 'Content-Type: text/plain; charset=utf-8', '', body].join('\r\n'))
}

export function isGmailConfigured() {
  return Boolean(CONNECTOR_ID)
}

export function gmailErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Gmail is not available yet. Reconnect the Google connector and try again.'
}

export type GmailMessage = { id: string; threadId?: string; from: string; subject: string; date: string; snippet: string; body: string }

export async function listRecentMessages(): Promise<GmailMessage[]> {
  const gmail = await getGmailClient()
  const listed = await gmail.users.messages.list({ userId: 'me', maxResults: 20, q: 'in:anywhere newer_than:90d' })
  const messages = await Promise.all((listed.data.messages ?? []).map(async ({ id }) => {
    if (!id) return null
    const message = await gmail.users.messages.get({ userId: 'me', id, format: 'full' })
    const payload = message.data.payload
    return { id, threadId: message.data.threadId ?? undefined, from: headerValue(payload?.headers, 'From'), subject: headerValue(payload?.headers, 'Subject'), date: headerValue(payload?.headers, 'Date'), snippet: message.data.snippet ?? '', body: findPlainTextPart(payload) }
  }))
  return messages.filter((message): message is GmailMessage => Boolean(message))
}

export async function createGmailDraft(input: { to: string; subject: string; body: string }) {
  const gmail = await getGmailClient()
  const draft = await gmail.users.drafts.create({ userId: 'me', requestBody: { message: { raw: createDraftRaw(input) } } })
  return draft.data.id
}

export async function listGmailDrafts() {
  const gmail = await getGmailClient()
  const listed = await gmail.users.drafts.list({ userId: 'me', maxResults: 50 })
  const drafts = await Promise.all((listed.data.drafts ?? []).map(async ({ id }) => {
    if (!id) return null
    const draft = await gmail.users.drafts.get({ userId: 'me', id, format: 'full' })
    const payload = draft.data.message?.payload
    return {
      id,
      to: headerValue(payload?.headers, 'To'),
      subject: headerValue(payload?.headers, 'Subject'),
      body: findPlainTextPart(payload),
      updatedAt: headerValue(payload?.headers, 'Date'),
    }
  }))
  return drafts.filter((draft): draft is NonNullable<typeof draft> => Boolean(draft))
}

export async function getMailboxProfile() {
  const gmail = await getGmailClient()
  const profile = await gmail.users.getProfile({ userId: 'me' })
  return profile.data.emailAddress ?? 'Connected Gmail mailbox'
}

export const scopes = GMAIL_SCOPES

export const gmailSetupNote = 'Read and draft access is managed by the Goodheart Partnerships Gmail connector.'

export const mailboxAddress = 'partnerships@goodheartapp.com'

export const connectorId = CONNECTOR_ID

export const gmailAppSubject = { type: 'app' as const }

export const gmailPermissions = ['Read recent partnership emails', 'Create drafts for review', 'Never send without approval']

export const gmailSafetyNote = 'This workspace can read messages and create drafts. It cannot send emails.'

export const gmailRouteDescription = 'Private outreach desk for the Goodheart Partnerships mailbox.'

export const gmailInboxQuery = 'in:anywhere newer_than:90d'

export const gmailDraftsOnly = true

export const gmailNoSend = true

export const gmailPrivacy = 'Keep this route behind Vercel Deployment Protection or your team authentication.'

export const gmailDefaultMaxResults = 20

export const gmailTokenSubjectType = 'app'

export const gmailProvider = 'Google Gmail'

export const gmailMailbox = 'partnerships@goodheartapp.com'

export const gmailWorkflow = 'Read, prepare, review'

export const gmailNextStep = 'Add CRM records before sending outreach.'

export const gmailStatus = 'connector-attached'

export const gmailAudience = 'Goodheart partnerships team'

export const gmailDataHandling = 'Tokens stay server-side and are never returned to the browser.'

export const gmailReviewRule = 'Every draft requires human review.'

export const gmailRoute = '/admin/outreach'

export const gmailReady = true

export const gmailVersion = 1

export const gmailOwner = 'DMT Outfitters LLC'

export const gmailContact = 'edidirect@edimassive.com'

export const gmailPurpose = 'Corporate Avatar: Off Duty sponsorship outreach'

export const gmailAuthModel = 'Vercel Connect app subject'

export const gmailEnvironment = 'production, preview, development'

export const gmailScopesLabel = 'gmail.readonly + gmail.compose'

export const gmailConnectLabel = 'Goodheart Partnerships Gmail'

export const gmailInternalOnly = true

export const gmailLaunchState = 'ready for mailbox authorization'

export const gmailNoPublicIndex = true

export const gmailEnd = true
