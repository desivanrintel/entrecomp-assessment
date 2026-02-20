export interface Thread {
  id: string;
  title: string;
  levels: Record<number, string>; // Descriptors for levels 1-8
}

export interface ExpertCompetence {
  name: string;
  area: "Ideas & Opportunities" | "Resources" | "Into Action";
  hint: string;
  description: string;
  threads: Thread[];
}

export const AREA_COLORS: Record<string, string> = {
  "Ideas & Opportunities": "#3b82f6", // Blue
  "Resources": "#f59e0b",             // Orange
  "Into Action": "#10b981"            // Green
};

export const EXPERT_ASSESSMENT_FRAMEWORK: ExpertCompetence[] = [
  {
    name: "Spotting Opportunities",
    area: "Ideas & Opportunities",
    hint: "Use your imagination and abilities to identify opportunities for creating value.",
    description: "Identify and seize opportunities to create value by exploring the social, cultural and economic landscape. Identify needs and challenges that need to be met. Establish new connections and bring together scattered elements of the landscape to create opportunities to create value.",
    threads: [
      {
        id: "so_seize",
        title: "Identify, create and seize opportunities",
        levels: {
          1: "I can find opportunities to help others.",
          2: "I can recognise opportunities to create value in my community and surroundings.",
          3: "I can explain what makes an opportunity to create value.",
          4: "I can proactively look for opportunities to create value, including out of necessity.",
          5: "I can describe different analytical approaches to identify entrepreneurial opportunities",
          6: "I can use my knowledge and understanding of the context to make opportunities to create value.",
          7: "I can judge opportunities for creating value and decide whether to follow these up at different levels of the system I am working in (for example, micro, meso or macro).",
          8: "I can spot and quickly take advantage of an opportunity."          
        }
      },
      {
        id: "so_challenges",
        title: "Focus on challenges",
        levels: {
          1: "I can find different examples of challenges that need solutions.",
          2: "I can recognise challenges in my community and surroundings that I can contribute to solving.",
          3: "I can identify opportunities to solve problems in alternative ways.",
          4: "I can redefine the description of a challenge, so that alternative opportunities to address it may become apparent.",
          5: "I can take apart established practices and challenge mainstream thought to create opportunities and look at challenges in different ways",
          6: "I can judge the right time to take an opportunity to create value.",
          7: "I can cluster different opportunities or identify synergies among different opportunities to make the most out of them.",
          8: "I can define opportunities where I can maintain a competitive advantage."
        }
      },
      {
        id: "so_needs",
        title: "Uncover needs",
        levels: {
          1: "I can find examples of groups who have benefited from a solution to a given problem.",
          2: "I can identify needs in my community and surroundings that have not been met.",
          3: "I can explain that different groups may have different needs.",
          4: "I can establish which user group, and which needs, I want to tackle through creating value.",
          5: "I can carry out a need’s analysis involving relevant stakeholders.",
          6: "I can identify challenges related to the contrasting needs and interests of different stakeholders.",
          7: "I can produce a ‘roadmap’ which matches the needs with the actions needed to deal with them and helps me create value.",
          8: "I can design projects which aim to anticipate future needs."
        }
      },
      {
        id: "so_analyse",
        title: "Analyse the context",
        levels: {
          1: "I can tell the difference between different areas where value can be created (for example, at home, in the community, in the environment, or in the economy or society).",
          2: "I can recognise the different roles the public, private and third sectors play in my region or country.",
          3: "I can tell the difference between contexts for creating value (for example, communities and informal networks, existing organisations, the market).",
          4: "I can identify my personal, social and professional opportunities for creating value, both in existing organisations or by setting up new ventures.",
          5: "I can identify the boundaries of the system that are relevant to my (or my team's) value creating activity.",
          6: "I can analyse an existing value creation activity by looking at it as a whole and identifying opportunities to develop it further.",
          7: "I can monitor relevant trends and see how they create threats and new opportunities to create value.",
          8: "I can promote a culture within my organisation that is open to spotting the weak signals of change, leading to new opportunities for creating value."
        }
      }
    ]
  },
  {
    name: "Creativity",
    area: "Ideas & Opportunities",
    hint: "Develop creative and purposeful ideas",
    description: "Develop several ideas and opportunities to create value, including better solutions to existing and new challenges. Explore and experiment with innovative approaches. Combine knowledge and resources to achieve valuable effects.",
    threads: [
      {
        id: "cr_curious",
        title: "Be curious and open",
        levels: {
          1: "I can show that I am curious about new things.",
          2: "I can explore new ways to make use of existing resources.",
          3: "I can experiment with my skills and competences in situations that are new to me.",
          4: "I can actively search for new solutions that meet my needs.",
          5: "I can actively search for new solutions that improve the value creating process.",
          6: "I can combine my understanding of different contexts to transfer knowledge, ideas, and solutions across different areas."
        }
      },
      {
        id: "cr_develop",
        title: "Develop Ideas",
        levels: {
          1: "I can develop ideas that solve problems that are relevant to me and my surroundings.",
          2: "Alone and as part of a team, I can develop ideas that create value for others.",
          3: "I can experiment with different techniques to generate alternative solutions to problems, using available resources in an effective way.",
          4: "I can test the value of my solutions with end users.",
          5: "I can describe different techniques to test innovative ideas with end users.",
          6: "I can set up processes to involve stakeholders in finding, developing, and testing ideas.",
          7: "I can tailor a variety of ways of involving stakeholders to suit the needs of my value-creating activity.",
          8: "I can design new processes to involve stakeholders in generating, developing, and testing ideas that create value."
        }
      },
      {
        id: "cr_problems",
        title: "Define Problems",
        levels: {
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
          6: "",
          7: "",
          8: ""
        }
      },
      {
        id: "cr_value",
        title: "Design Value",
        levels: {
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
          6: "",
          7: "",
          8: ""
        }
      },
      {
        id: "cr_innovative",
        title: "Be Innovative",
        levels: {
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
          6: "",
          7: "",
          8: ""
        }
      }
    ]
  },
  {
    name: "Vision",
    area: "Ideas & Opportunities",
    hint: "",
    description: "Imagine the future. Develop a vision to turn ideas into action. Visualise future scenarios to help guide effort and action.",
    threads: [
      {
        id: "",
        title: "",
        levels: {
          1: "",
          4: "",
          6: "",
          8: ""
        }
      }
    ]
  },
  {
    name: "Valuing Ideas",
    area: "Ideas & Opportunities",
    hint: "",
    description: "Judge what value is in social, cultural and economic terms. Recognise the potential an idea has for creating value and identify suitable ways of making the most out of it.",
    threads: [
      {
        id: "",
        title: "",
        levels: {
          1: "",
          4: "",
          6: "",
          8: ""
        }
      }
    ]
  },
  {
    name: "Ethical & Sustainabable Thinking",
    area: "Ideas & Opportunities",
    hint: "",
    description: "Assess the consequences of ideas that bring value and the effect of entrepreneurial action on the target community, the market, society and the environment. Reflect on h w sustainable long-term social, cultural and economic goals are, and the course of action chosen. Act responsibly.",
    threads: [
      {
        id: "",
        title: "",
        levels: {
          1: "",
          4: "",
          6: "",
          8: ""
        }
      }
    ]
  },
  {
    name: "Self-Awareness & Self-Efficacy",
    area: "Resources",
    hint: "",
    description: "Reflect on your needs, aspirations and wants in the short, medium and long term. Identify and assess your individual and group strengths and weaknesses. Believe in your ability to influence the course of events, despite uncertainty, setbacks and temporary failures.",
    threads: [
      {
        id: "",
        title: "",
        levels: {
          1: "",
          4: "",
          6: "",
          8: ""
        }
      }
    ]
  },
  {
    name: "Motivation & Perseverance",
    area: "Resources",
    hint: "",
    description: "Be determined to turn ideas into action and satisfy your need to achieve. Be prepared to be patient and keep trying to achieve your long- term individual or group aims. Be resilient under pressure, adversity, and temporary failure.",
    threads: [
      {
        id: "",
        title: "",
        levels: {
          1: "",
          4: "",
          6: "",
          8: ""
        }
      }
    ]
  },
  {
    name: "Mobilising Resources",
    area: "Resources",
    hint: "",
    description: "Get and manage the material, non-material and digital resources needed to turn ideas into action. Make the most of limited resources. Get and manage the competences needed at any stage, including technical, legal, tax and digital competences (for example, through suitable partnerships, networking, outsourcing and crowd-sourcing).",
    threads: [
      {
        id: "",
        title: "",
        levels: {
          1: "",
          4: "",
          6: "",
          8: ""
        }
      }
    ]
  },
  {
    name: "Financial & Economic Literacy",
    area: "Resources",
    hint: "",
    description: "Estimate the cost of turning an idea into a value-creating activity. Plan, put in place and evaluate financial decisions over time. Manage financing to ma e sure my value-creating activity can last over the long term. ",
    threads: [
      {
        id: "",
        title: "",
        levels: {
          1: "",
          4: "",
          6: "",
          8: ""
        }
      }
    ]
  },
  {
    name: "Mobilising Others",
    area: "Resources",
    hint: "",
    description: "Inspire and enthuse relevant stakeholders. Get the support needed to achieve valuable outcomes. Demonstrate effective communication, persuasion, negotiation and leadership ",
    threads: [
      {
        id: "",
        title: "",
        levels: {
          1: "",
          4: "",
          6: "",
          8: ""
        }
      }
    ]
  },
  {
    name: "Taking the initiative",
    area: "Into Action",
    hint: "",
    description: "Initiate processes that create value. Take up challenges. Act and work independently to achieve goals, stick to intentions and carry out planned tasks. ",
    threads: [
      {
        id: "",
        title: "",
        levels: {
          1: "",
          4: "",
          6: "",
          8: ""
        }
      }
    ]
  },
  {
    name: "Planning & Management",
    area: "Into Action",
    hint: "",
    description: "Set long-, medium- and short-term goals. Define priorities and action plans. Adapt to unforeseen changes.",
    threads: [
      {
        id: "",
        title: "",
        levels: {
          1: "",
          4: "",
          6: "",
          8: ""
        }
      }
    ]
  },
  {
    name: "Coping with uncertainty, ambiguity & risk",
    area: "Into Action",
    hint: "",
    description: "Make decisions when the result of that decision is uncertain, when the information available is partial or ambiguous, or when there is a risk of unintended outcomes. Within the valuecreating process, include structured ways of testing ideas and prototypes from the early stages, to reduce risks of failing. Handle fast-moving situations promptly and flexibly.",
    threads: [
      {
        id: "",
        title: "",
        levels: {
          1: "",
          4: "",
          6: "",
          8: ""
        }
      }
    ]
  },
  {
    name: "Working with others",
    area: "Into Action",
    hint: "",
    description: "Work together and co-operate with others to develop ideas and turn them into action. Network. Solve conflicts and face up to competition positively when necessary.",
    threads: [
      {
        id: "",
        title: "",
        levels: {
          1: "",
          4: "",
          6: "",
          8: ""
        }
      }
    ]
  },
  {
    name: "Learning through experience",
    area: "Into Action",
    hint: "",
    description: "Use any initiative for value creation as a learning opportunity. Learn with others, including peers and mentors. Reflect and learn from both success and failure (your own and other people’s).",
    threads: [
      {
        id: "",
        title: "",
        levels: {
          1: "",
          4: "",
          6: "",
          8: ""
        }
      }
    ]
  }

  // ... Continue for all 15 competences based on pages 18-42
];

// Flattened list for the Wizard (each thread is a separate step)
export const EXPERT_STEPS = EXPERT_ASSESSMENT_FRAMEWORK.flatMap(comp => 
  comp.threads.map(thread => ({
    ...thread,
    parentCompetence: comp.name,
    area: comp.area
  }))
);