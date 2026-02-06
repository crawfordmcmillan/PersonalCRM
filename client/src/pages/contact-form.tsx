import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/shared/button'
import { Input } from '@/components/shared/input'
import { Textarea } from '@/components/shared/textarea'
import { useContact, useCreateContact, useUpdateContact } from '@/api/queries'

const SPHERES = ['Love Them', 'Like Them', 'Know Them']
const CATEGORIES = ['personal', 'professional', 'family', 'acquaintance']

const categoryLabels: Record<string, string> = {
  personal: 'Personal',
  professional: 'Professional',
  family: 'Family',
  acquaintance: 'Acquaintance',
}

interface FormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  location: string
  sphere: string
  category: string
  frequencyOverrideDays: string
  notes: string
  interests: string
  familyDetails: string
  howWeMet: string
  whatMatters: string
  linkedinUrl: string
  twitterUrl: string
  websiteUrl: string
}

const emptyForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  location: '',
  sphere: 'Like Them',
  category: 'personal',
  frequencyOverrideDays: '',
  notes: '',
  interests: '',
  familyDetails: '',
  howWeMet: '',
  whatMatters: '',
  linkedinUrl: '',
  twitterUrl: '',
  websiteUrl: '',
}

export function ContactFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const contactId = Number(id)
  const navigate = useNavigate()
  const { data: existing, isLoading } = useContact(isEdit ? contactId : 0)
  const createContact = useCreateContact()
  const updateContact = useUpdateContact()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  useEffect(() => {
    if (existing && isEdit) {
      setForm({
        firstName: existing.firstName || '',
        lastName: existing.lastName || '',
        email: existing.email || '',
        phone: existing.phone || '',
        company: existing.company || '',
        jobTitle: existing.jobTitle || '',
        location: existing.location || '',
        sphere: existing.sphere || 'Like Them',
        category: existing.category || 'personal',
        frequencyOverrideDays: existing.frequencyOverrideDays
          ? String(existing.frequencyOverrideDays)
          : '',
        notes: existing.notes || '',
        interests: existing.interests || '',
        familyDetails: existing.familyDetails || '',
        howWeMet: existing.howWeMet || '',
        whatMatters: existing.whatMatters || '',
        linkedinUrl: existing.linkedinUrl || '',
        twitterUrl: existing.twitterUrl || '',
        websiteUrl: existing.websiteUrl || '',
      })
    }
  }, [existing, isEdit])

  function update(field: keyof FormState) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.firstName.trim()) next.firstName = 'First name is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const payload: Record<string, unknown> = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim() || undefined,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      company: form.company.trim() || undefined,
      jobTitle: form.jobTitle.trim() || undefined,
      location: form.location.trim() || undefined,
      sphere: form.sphere,
      category: form.category,
      frequencyOverrideDays: form.frequencyOverrideDays
        ? Number(form.frequencyOverrideDays)
        : undefined,
      notes: form.notes.trim() || undefined,
      interests: form.interests.trim() || undefined,
      familyDetails: form.familyDetails.trim() || undefined,
      howWeMet: form.howWeMet.trim() || undefined,
      whatMatters: form.whatMatters.trim() || undefined,
      linkedinUrl: form.linkedinUrl.trim() || undefined,
      twitterUrl: form.twitterUrl.trim() || undefined,
      websiteUrl: form.websiteUrl.trim() || undefined,
    }

    try {
      if (isEdit) {
        await updateContact.mutateAsync({ id: contactId, data: payload })
        toast.success('Contact updated')
        navigate(`/contacts/${contactId}`)
      } else {
        const created = await createContact.mutateAsync(payload)
        toast.success('Contact created')
        navigate(`/contacts/${created.id}`)
      }
    } catch {
      toast.error(isEdit ? 'Failed to update contact' : 'Failed to create contact')
    }
  }

  const isPending = createContact.isPending || updateContact.isPending

  if (isEdit && isLoading) {
    return (
      <div className="animate-pulse p-8">
        <div className="h-6 w-48 rounded bg-gray-200 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit contact' : 'Add contact'} />

      <form onSubmit={handleSubmit} className="max-w-2xl p-8 space-y-8">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text">Basic info</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              value={form.firstName}
              onChange={update('firstName')}
              error={errors.firstName}
              required
            />
            <Input
              label="Last name"
              value={form.lastName}
              onChange={update('lastName')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={update('email')}
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={update('phone')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company"
              value={form.company}
              onChange={update('company')}
            />
            <Input
              label="Job title"
              value={form.jobTitle}
              onChange={update('jobTitle')}
            />
          </div>
          <Input
            label="Location"
            value={form.location}
            onChange={update('location')}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text">Relationship</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text">
                Sphere
              </label>
              <select
                value={form.sphere}
                onChange={update('sphere')}
                className="block w-full rounded-lg border border-border/80 bg-white px-3.5 py-2.5 text-sm text-text shadow-sm shadow-black/[0.02] focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
              >
                {SPHERES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text">
                Category
              </label>
              <select
                value={form.category}
                onChange={update('category')}
                className="block w-full rounded-lg border border-border/80 bg-white px-3.5 py-2.5 text-sm text-text shadow-sm shadow-black/[0.02] focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {categoryLabels[c]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Input
            label="Frequency override (days)"
            type="number"
            value={form.frequencyOverrideDays}
            onChange={update('frequencyOverrideDays')}
            placeholder="Leave empty for default"
            min={1}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text">Context</h2>
          <Textarea
            label="Notes"
            value={form.notes}
            onChange={update('notes')}
            placeholder="General notes about this person..."
          />
          <Textarea
            label="Interests"
            value={form.interests}
            onChange={update('interests')}
            placeholder="Hobbies, passions, topics they care about..."
          />
          <Textarea
            label="Family details"
            value={form.familyDetails}
            onChange={update('familyDetails')}
            placeholder="Partner, kids, pets..."
          />
          <Textarea
            label="How we met"
            value={form.howWeMet}
            onChange={update('howWeMet')}
            placeholder="Where and when you first connected..."
          />
          <Textarea
            label="What matters to them"
            value={form.whatMatters}
            onChange={update('whatMatters')}
            placeholder="Their priorities, goals, concerns..."
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text">Links</h2>
          <Input
            label="LinkedIn"
            value={form.linkedinUrl}
            onChange={update('linkedinUrl')}
            placeholder="https://linkedin.com/in/..."
          />
          <Input
            label="Twitter"
            value={form.twitterUrl}
            onChange={update('twitterUrl')}
            placeholder="https://twitter.com/..."
          />
          <Input
            label="Website"
            value={form.websiteUrl}
            onChange={update('websiteUrl')}
            placeholder="https://..."
          />
        </section>

        <div className="flex items-center gap-3 border-t border-border/60 pt-6">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : isEdit ? 'Save changes' : 'Create contact'}
          </Button>
          <Link to={isEdit ? `/contacts/${contactId}` : '/contacts'}>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
