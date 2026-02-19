// app/lib/constants.ts

export interface CompetencyStep {
  area: string;
  description: string;
  fields: {
    key: string;
    label: string;
    description: string;
  }[];
}

export const ENTRECOMP_STEPS: CompetencyStep[] = [
  {
    area: "Ideas & Opportunities",
    description: "Help you identify and seize opportunities to create value.",
    fields: [
      { key: "spotting_opportunities", label: "Spotting Opportunities", description: "Identify and seize opportunities to create value." },
      { key: "creativity", label: "Creativity", description: "Develop creative and purposeful ideas." },
      { key: "vision", label: "Vision", description: "Work towards a vision of the future." },
      { key: "valuing_ideas", label: "Valuing Ideas", description: "Make the most of ideas and opportunities." },
      { key: "ethical_thinking", label: "Ethical & Sustainable Thinking", description: "Assess the consequences of ideas." }
    ]
  },
  {
    area: "Resources",
    description: "The resources needed to get things moving.",
    fields: [
      { key: "self_awareness", label: "Self-awareness & Self-efficacy", description: "Believe in yourself and keep developing." },
      { key: "motivation", label: "Motivation & Perseverance", description: "Stay focused and don't give up." },
      { key: "mobilising_resources", label: "Mobilising Resources", description: "Gather and manage the resources you need." },
      { key: "financial_literacy", label: "Financial & Economic Literacy", description: "Develop financial and economic acumen." },
      { key: "mobilising_others", label: "Mobilising Others", description: "Inspire and get others on board." }
    ]
  },
  {
    area: "Into Action",
    description: "How to turn ideas into value-creating activities.",
    fields: [
      { key: "taking_initiative", label: "Taking the Initiative", description: "Go for it!" },
      { key: "planning_management", label: "Planning & Management", description: "Prioritise, organise and plan." },
      { key: "coping_with_ambiguity", label: "Coping with Ambiguity & Risk", description: "Make decisions dealing with uncertainty." },
      { key: "working_with_others", label: "Working with Others", description: "Team up, collaborate and network." },
      { key: "learning_through_experience", label: "Learning through Experience", description: "Learn by doing." }
    ]
  }
];