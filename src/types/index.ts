export interface SliderImage {
  id: string
  url: string
  title: string
  alt: string
}

export interface Project {
  id: string
  title: string
  technologies: string[]
  role: string
  highlights: string[]
  downloadUrl?: string
  media: string[]
}

export interface Contact {
  platform: string
  url: string
  icon: string
}