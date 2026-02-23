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
          1: "I can approach open-ended problems (problems that can have many solutions) with curiosity.",
          2: "I can explore open-ended problems in many ways so as to generate multiple solutions.",
          3: "I can take part in group dynamics aimed at defining open-ended problems.",
          4: "I can reshape open-ended problems to fit my skills.",
          5: "I can describe and explain different approaches to shaping open-ended problems and different problem solving strategies.",
          6: "I can help others create value by encouraging experimentation and using creative techniques to approach problems and generate solutions.",
          7: "I can initiate, develop, manage and complete a creative project.",
          8: "I can use a mix of creative techniques to keep generating value over time."
        }
      },
      {
        id: "cr_value",
        title: "Design Value",
        levels: {
          1: "I can assemble objects that create value for me and others.",
          2: "I can improve existing products, services and processes so that they better meet my needs or those of my peers and the community.",
          3: "I can identify the basic functions that a prototype should have to illustrate the value of my idea.",
          4: "I can assemble, test and progressively refine prototypes that simulate the value I want to create.",
          5: "I can create (alone or with others) products or services that solve my problems and my needs.",
          6: "I can develop and deliver value in stages, launching with the core features of my (or my team’s) idea and progressively adding more.",
          7: "I can apply different design approaches to create value through new products, processes or services.",
          8: "I can design and put in place innovative processes to create value."
        }
      },
      {
        id: "cr_innovative",
        title: "Be Innovative",
        levels: {
          1: "I can find examples of innovative products, services and solutions.",
          2: "I can describe how some innovations have transformed society.",
          3: "I can tell the difference between types of innovations (for example, process versus product innovation and social innovation, incremental versus disruptive innovation).",
          4: "I can judge if an idea, product or process is innovative or just new to me.",
          5: "I can describe how innovations diffuse in society, culture and the market.",
          6: "I can describe different levels of innovation (for example, incremental, breakthrough or transformational) and their role in value-creating activities.",
          7: "I can identify the steps needed to research the potential for an innovative idea in light of its development into an existing enterprise, a new venture or an opportunity for social change.",
          8: "I can manage innovation processes that respond to emerging needs and make the most of opportunities as they become available."
        }
      }
    ]
  },
  {
    name: "Vision",
    area: "Ideas & Opportunities",
    hint: "Work towards your vision of the future.",
    description: "Imagine the future. Develop a vision to turn ideas into action. Visualise future scenarios to help guide effort and action.",
    threads: [
      {
        id: "vi_imagine",
        title: "Imagine",
        levels: {
          1: "I can imagine a desirable future.",
          2: "I can develop simple future scenarios where value is created for my community and surroundings.",
          3: "I can develop (alone or with others) an inspiring vision for the future that involves others.",
          4: "I can build future scenarios around my value-creating activity.",
          5: "I can use my understanding of the context to identify different strategic visions for creating value.",
          6: "I can discuss my (or my team's) strategic vision for creating value.",
          7: "I can develop (alone or with others) and compare different future scenarios.",
          8: "I can show different audiences the benefits of my vision during turbulent times."
        }
      },
      {
        id: "vi_think",
        title: "Think Strategically",
        levels: {
          3: "I can explain what a vision is and what purpose it serves.",
          4: "I am aware of what is needed to build a vision.",
          5: "I can explain the role of a vision statement for strategic planning.",
          6: "I can prepare a vision statement for my (or my team's) value creating activity that guides internal decision making throughout the whole process of creating value.",
          7: "I can plan backwards from my vision to design the necessary strategy to achieve it.",
          8: "I can encourage enthusiasm and a sense of belonging around a convincing vision."
        }
      },
      {
        id: "vi_action",
        title: "Guide Action",
        levels: {
          3: "My vision for creating value drives me to make the effort to turn ideas into action.",
          4: "I can decide what type of vision for creating value I would like to contribute to.",
          5: "I can identify the changes needed to achieve my vision.",
          6: "I can promote initiatives for change and transformation that contribute to my vision.",
          7: "I can identify challenges related to my (or my team's) vision, while respecting the different levels of the system and the variety of stake- holders affected.",
          8: "I can create (alone or with others) a ‘roadmap’ based on my vision for creating value."
        }
      }
    ]
  },
  {
    name: "Valuing Ideas",
    area: "Ideas & Opportunities",
    hint: "Make the most of ideas and opportunities.",
    description: "Judge what value is in social, cultural and economic terms. Recognise the potential an idea has for creating value and identify suitable ways of making the most out of it.",
    threads: [
      {
        id: "vi_value",
        title: "Recognise the value of ideas",
        levels: {
          1: "I can find examples of ideas that have value for myself and others.",
          2: "I can show how different groups, such as firms and institutions, create value in my community and surroundings.",
          3: "I can tell the difference between social, cultural and economic value.",
          4: "I can decide which type of value I want to act on and then choose the most appropriate pathway to do so.",
          5: "I recognise the many forms of value that could be created through entrepreneurship, such as social, cultural or economic value.",
          6: "I can break down a value chain into its different parts and identify how value is added in each part.",
          7: "I can develop strategies to effectively make the most of opportunities to create value in my organisation or venture.",
          8: "I can state the value of a new idea from different stakeholders' perspectives."
        }
      },
      {
        id: "vi_protect",
        title: "Share and protect ideas",
        levels: {
          1: "I can clarify that other people’s ideas can be used and acted on, while respecting their rights.",
          2: "I can explain that ideas can be shared and circulated for the benefit of everyone or can be protected by certain rights, for example, copyrights or patents.",
          3: "I can tell the difference between types of licences that can be used to share ideas and protect rights.",
          4: "I can choose the most appropriate licence for the purpose of sharing and protecting the value created by my ideas.",
          5: "I can tell the difference between trademarks, registered design rights, patents, geographical indications, trade secrets, confidentiality agreements and copyright licences, including open, public-domain licences such as creative commons.",
          6: "When creating ideas with others, I can outline a dissemination and exploitation agreement that benefits all partners involved.",
          7: "I can develop a tailored strategy on intellectual property rights that deals with geographic requirements.",
          8: "I can develop a strategy on intellectual property rights that is tailored to the age of my portfolio."
        }
      }
      
    ]
  },
  {
    name: "Ethical & Sustainabable Thinking",
    area: "Ideas & Opportunities",
    hint: "Assess the consequences and impact of ideas, opportunities and actions",
    description: "Assess the consequences of ideas that bring value and the effect of entrepreneurial action on the target community, the market, society and the environment. Reflect on h w sustainable long-term social, cultural and economic goals are, and the course of action chosen. Act responsibly.",
    threads: [
      {
        id: "vi_ethically",
        title: "Behave Ethically",
        levels: {
          1: "I can recognise behaviours that show integrity, honesty, responsibility, courage and commitment.",
          2: "I can describe in my own words the importance of integrity and ethical values.",
          3: "I can apply ethical thinking to consumption and production processes.",
          4: "I am driven by honesty and integrity when taking decisions.",
          5: "I can argue that ideas for creating value should be supported by ethics and values relating to gender, equality, fairness, social justice and environmental sustainability.",
          6: "I can take responsibility for promoting ethical behaviour in my area of influence, (for example, by promoting gender balance, highlighting inequalities and any lack of integrity).",
          7: "I make it my priority to make sure that ethical behaviour is respected and promoted in my area of influence.",
          8: "I take action against unethical behaviour."
        }
      },
      {
        id: "vi_sustainably",
        title: "Think Sustainably",
        levels: {
          1: "I can list examples of environmentally friendly behaviour that benefits a community.",
          2: "I can recognise examples of environmentally friendly behaviour by companies that creates value for society as a whole.",
          3: "I can identify practices that are not sustainable and their implications for the environment.",
          4: "I can produce a clear problem statement when faced with practices that are not sustainable.",
          5: "I can discuss the impact an organisation has on the environment (and vice versa).",
          6: "I can discuss the relationship between society and technical developments, relating to their implications for the environment.",
          7: "I can choose adequate methods for analysing environmental impact based on their advantages and disadvantages.",
          8: "I can contribute to self-regulation discussions within my sector of operations."
        }
      },
      {
        id: "vi_impact",
        title: "Assess Impact",
        levels: {
          1: "I can find and list examples of changes caused by human action in social, cultural, environmental or economic contexts.",
          2: "I can tell the difference between the impact of a value creating activity on the target community and the broader impact on society.",
          3: "I can identify the impact that taking up opportunities will have on me and my team, on the target group and on the surrounding community.",
          4: "I can identify stakeholders who are affected by the change brought about by my (or my team's) value creating activity, including stakeholders who cannot speak up (for example, future generations, climate or nature).",
          5: "I can analyse the implications of my value creating activity within the boundaries of the system I am working in.",
          6: "I can define the purpose of the impact assessment, impact monitoring, and evaluation of impact.",
          7: "I can choose ‘measure indicators’ to monitor and assess the impact of my value creating activity.",
          8: "I can carry out impact assessment, impact monitoring, and impact evaluation on my valuecreating activity."
        }
      },
      {
        id: "vi_accountable",
        title: "Be Accountable",
        levels: {
          4: "I can tell the difference between accounting for use of resources and accounting for the impact of my value creating activity on stakeholders and the environment.",
          5: "I can tell the difference between input, output, outcomes and impact.",
          6: "I can discuss a range of accountability methods for both functional and strategic accountability.",
          7: "I can use the accountability methods that hold me responsible to our internal and external stakeholders.",
          8: "I can design ways to be accountable to all of our stakeholders."
        }
      }
    ]
  },
  {
    name: "Self-Awareness & Self-Efficacy",
    area: "Resources",
    hint: "Believe in yourself and keep developing.",
    description: "Reflect on your needs, aspirations and wants in the short, medium and long term. Identify and assess your individual and group strengths and weaknesses. Believe in your ability to influence the course of events, despite uncertainty, setbacks and temporary failures.",
    threads: [
      {
        id: "sa_aspirations",
        title: "Follow your aspirations",
        levels: {
          1: "I can identify my needs, wants, interests and goals.",
          2: "I can describe my needs, wants, interests and goals.",
          3: "I can commit to fulfilling my needs, wants, interests and goals.",
          4: "I can reflect on my individual and group needs, wants, interests and aspirations in relation to opportunities and future prospects.",
          5: "I can translate my needs, wants, interests and aspirations into goals that help me reach them.",
          8: "I can help others to reflect on their needs, wants, interests and aspirations and how they can turn these into goals."
        }
      },
      {
        id: "sa_sw",
        title: "Identify your strengths and Weaknesses",
        levels: {
          2: "I can identify things I am good at and things I am not good at.",
          3: "I can judge my strengths and weaknesses and those of others in relation to opportunities for creating value.",
          4: "I am driven by the desire to use my strengths and abilities to make the most of opportunities to create value.",
          5: "I can team up with others to compensate for our weaknesses and add to our strengths.",
          8: "I can help others identify their strengths and weaknesses."
        }
      },
      {
        id: "sa_ability",
        title: "Believe in your ability",
        levels: {
          1: "I believe in my ability to do what I am asked successfully.",
          2: "I believe in my ability to achieve what I intend to.",
          3: "I can judge the control I have over my achievements (compared with any control from outside influences).",
          4: "I believe I can influence people and situations for the better.",
          5: "I believe in my ability to carry out what I have imagined and planned, despite obstacles, limited resources and resistance from others.",
          8: "I believe in my ability to understand and take the good out of experiences that others may label as failures."
        }
      },
      {
        id: "sa_future",
        title: "Shape your future",
        levels: {
          1: "I can list different types of jobs and their key functions.",
          2: "I can describe which qualities and abilities are needed for different jobs, and which of these qualities and abilities I have.",
          3: "I can describe my skills and competences relating to career options, including self- employment.",
          4: "I can use my skills and competences to change my career path, as a result of new opportunities or from necessity.",
          5: "I can discuss how a realistic understanding and evaluation of my personal attitudes, skills and knowledge can influence my decision-making, relationships with other people and quality of life.",
          6: "I can choose professional development opportunities with my team and organisation based on a clear understanding of our strengths and weaknesses.",
          7: "I can design professional development strategies for my team and organisation based on a clear understanding of our strengths and weaknesses, in relation to both current and future opportunities to create value.",
          8: "I can design strategies to overcome my (or my team’s or organisation’s) weaknesses and to develop our strengths in anticipating future needs."
        }
      }
    ]
  },
  {
    name: "Motivation & Perseverance",
    area: "Resources",
    hint: "Stay focused and don’t give up.",
    description: "Be determined to turn ideas into action and satisfy your need to achieve. Be prepared to be patient and keep trying to achieve your long- term individual or group aims. Be resilient under pressure, adversity, and temporary failure.",
    threads: [
      {
        id: "mp_driven",
        title: "Stay Driven",
        levels: {
          1: "I am driven by the possibility to do or contribute to some- thing that is good for me or for others.",
          2: "I am motivated by the idea of creating value for myself and others.",
          3: "I can anticipate the feeling of achieving my goals and this motivates me.",
          8: "I can regulate my own behaviour to stay driven and achieve the benefits of turning ideas into action."
        }
      },
      {
        id: "mp_determined",
        title: "Be Determined",
        levels: {
          1: "I see tasks as challenges to do my best.",
          2: "I am motivated by challenges.",
          3: "I can set challenges to motivate myself.",
          4: "I am willing to put effort in and use resources to overcome challenges and achieve my (or my team’s) goals.",
          5: "I drive my effort by using my desire for achievement and belief in my ability to achieve.",
          6: "I can coach others to stay motivated, encouraging them to commit to what they want to achieve.",
          7: "I can create the right climate to motivate my team (for example, by celebrating successes, by learning from failures and by encouraging innovative ways to tackle problems).",
          8: "I consider all outcomes as temporary solutions appropriate to their time and context, and so am motivated to make sure they develop in a continuous cycle of improvement and innovation."
        }
      },
      {
        id: "mp_focus",
        title: "Focus on what keeps you motivated",
        levels: {
          2: "I can recognise different ways of motivating myself and others to create value.",
          3: "I can reflect on the social incentives associated with having a sense of initiative and creating value for myself and others.",
          4: "I can tell the difference between personal and external factors that motivate me or others when creating value.",
          5: "I can use strategies to stay motivated (for example, set goals, monitor performance and evaluate my progress).",
          6: "I can use strategies to keep my team motivated and focused on creating value.",
          7: "I can design effective ways to attract talented people and keep them motivated.",
          8: "I can reward initiative, effort, and achievement appropriately with- in my team and organisation."
        }
      },
      {
        id: "mp_resilient",
        title: "Be Resilient",
        levels: {
          1: "I show passion and willingness to achieve my goals.",
          2: "I am determined and persevere when trying to achieve my (or my team’s) goals.",
          3: "I can overcome simple adverse circumstances.",
          4: "I can judge when it is not worth continuing with an idea.",
          5: "I can persevere in the face of adversities when trying to achieve my goals.",
          6: "I can devise strategies to overcome standard adverse circumstances.",
          7: "I can cope with unexpected change, setbacks and failures (for example, job loss).",
          8: "I can make sure that my team or organisation stay positive when making difficult decisions and dealing with failure."
        }
      },
      {
        id: "",
        title: "Don't Give Up",
        levels: {
          1: "I do not give up and I can keep going even when facing difficulties.",
          2: "I am not afraid of working hard to achieve my goals.",
          3: "I can delay achieving my goals in or- der to gain greater value, thanks to prolonged effort.",
          4: "I can maintain effort and interest, despite setbacks.",
          5: "I can celebrate short-term achievements, in order to stay motivated.",
          6: "I can inspire others to work hard on their goals by showing passion and a strong sense of ownership.",
          7: "I can stay focused on my vision and goals, despite challenges."
        }
      }
    ]
  },
  {
    name: "Mobilising Resources",
    area: "Resources",
    hint: "Get and manage the resources you need.",
    description: "Get and manage the material, non-material and digital resources needed to turn ideas into action. Make the most of limited resources. Get and manage the competences needed at any stage, including technical, legal, tax and digital competences (for example, through suitable partnerships, networking, outsourcing and crowd-sourcing).",
    threads: [
      {
        id: "mr_manage",
        title: "Manage resources (material and non-material)",
        levels: {
          1: "I recognise that resources are not unlimited.",
          2: "I can appreciate the importance of sharing resources with others.",
          3: "I can experiment with different combinations of resources to turn my ideas into action.",
          4: "I can get and manage the necessary resources to turn my idea into action.",
          5: "I can develop a plan for dealing with limited resources when setting up my value creating activity.",
          6: "I can get together the necessary resources to develop my value creating activity.",
          7: "I can allocate enough resources to each step of my (or my team's) action plan and for the value creating activity (for example, time, finances, and my team’s skills, knowledge and experience).",
          8: "I can judge the key resources needed to support an innovative idea or opportunity to develop an existing business, launch a new venture, or initiate a social enterprise."
        }
      },
      {
        id: "mr_responsibly",
        title: "Use resources responsibly",
        levels: {
          1: "I value my possessions and use them responsibly.",
          2: "I can describe how resources last longer through reuse, repair and recycling.",
          3: "I can discuss the principles of circular economy and resource efficiency.",
          4: "I use resources responsibly and efficiently (for example, energy, materials in the supply chain or manufacturing process, public spaces).",
          5: "I take into account the non-material cost of using resources when taking decisions about my value creating activities.",
          6: "I can choose and put in place effective resource management procedures (for example, life-cycle analysis, solid waste).",
          7: "I can identify the opportunities that using resources efficiently and the circular economy bring to my organisation.",
          8: "I can design and put in place innovative ways to lower the overall impact of my value-creating activity on the environment, the community and society, and measure the improvement."
        }
      },
      {
        id: "mr_make",
        title: "Make the most of your time",
        levels: {
          1: "I can recognise different uses for my time (for example, studying, playing, resting).",
          2: "I value my time as a scarce resource. ",
          3: "I can discuss the need for investing time in different value creating activities.",
          4: "I can use my time effectively to achieve my goals.",
          5: "I can manage my time effectively, using techniques and tools that help make me (or my team) productive.",
          6: "I can help others manage their time effectively.",
          7: "I can put in place effective time management procedures.",
          8: "I can develop effective time management procedures that meet the specific needs of my value creating activity."
        }
      },
      {
        id: "mr_support",
        title: "Get support",
        levels: {
          1: "I can look for help when I am having difficulty achieving what I have decided to do.",
          2: "I can identify sources of help for my value-creating activity (for example, teachers, peers, mentors).",
          3: "I can describe the concepts of division of labour and job specialisation.",
          4: "I can find and list public and private services to support my value-creating activity (for example, incubator, social enterprise advisors, start-up angels, chamber of commerce).",
          5: "I can find digital solutions (for example, free, paid for, or open source) that can help me manage my value creating activities efficiently.",
          6: "I can find support to help me take advantage of an opportunity to create value (for example, advisor or consultancy services, peer or mentor support).",
          7: "I can effectively delegate tasks within and outside my organisation to make the most value (for example, outsourcing, partnering, acquisitions, crowdsourcing).",
          8: "I can develop a network of flexible and responsive providers from outside the organisation who support my value creating activity."
        }
      }
    ]
  },
  {
    name: "Financial & Economic Literacy",
    area: "Resources",
    hint: "Develop financial and economic know-how.",
    description: "Estimate the cost of turning an idea into a value-creating activity. Plan, put in place and evaluate financial decisions over time. Manage financing to ma e sure my value-creating activity can last over the long term. ",
    threads: [
      {
        id: "fel_understand",
        title: "Understand economical and financial concepts",
        levels: {
          1: "I can recall basic terminology and symbols related to money.",
          2: "I can explain simple economic concepts (for ex ample, supply and demand, market price, trade).",
          3: "I can use the concept of opportunity costs and comparative advantage to explain why exchanges happen between individuals, regions and nations.",
          4: "I can read income statements and balance sheets.",
          5: "I can explain the difference between a balance sheet and a profit and loss account.",
          6: "I can build financial indicators (for example, return on investment).",
          7: "I can use financial indicators to assess the financial health of a value creating activity.",
          8: "I can use financial indicators to compare the financial health of my value-creating activity with that of competitors’"
        }
      },
      {
        id: "fel_budget",
        title: "Budget",
        levels: {
          1: "I can judge what to use my money for.",
          2: "I can draw up a simple household budget in a responsible manner. ",
          3: "I can draw up a budget for a value creating activity.",
          4: "I can judge the cashflow needs of a value creating activity.",
          5: "I can apply the financial planning and forecasting concepts that I need to turn ideas into action (for example, profit or not for profit).",
          6: "I can judge the cashflow needs of a complex project.",
          7: "I can judge the cashflow needs of an organisation that handles many value creating activities that depend on each other.",
          8: "I can create a plan for the financial and economic long-term sustainability of my (or my team's) value creating activity."
        }
      },
      {
        id: "fel_funding",
        title: "Find Funding",
        levels: {
          1: "I can identify the main types of income for families, businesses, nonprofit organisations and the state.",
          2: "I can describe the main role of banks in the economy and society. ",
          3: "I can explain that value creating activities can take different forms (a business, a social enterprise, a nonprofit organisation and so on) and can have different structures of ownership (individual company, limited company, co-operative and so on).",
          4: "I can identify public and private sources of funding for my value creating activity (for example, prizes, crowdfunding, and shares).",
          5: "I can choose the most appropriate sources of funding to start up or expand a value creating activity.",
          6: "I can apply for public or private business support programmes, financing schemes, public subsidies or calls for tender.",
          7: "I can raise funds and secure revenue from different sources, and manage the diversity of those sources.",
          8: "I can judge an opportunity as a possible investor."
        }
      },
      {
        id: "fel_taxation",
        title: "Understand taxation",
        levels: {
          1: "I can outline the purpose of taxation.",
          2: "I can explain how taxation finances the activities of a country and its part in providing public goods and services.",
          4: "I can estimate the main accountancy and tax obligations I need to fulfil to meet the tax requirements for my activities.",
          5: "I can estimate how my financial decisions (investments, buying assets, goods and so on) affect my tax.",
          6: "I can make financial decisions based on current taxation schemes.",
          8: "I can make financial decisions based on taxation schemes of different countries and territories."
        }
      }
    ]
  },
  {
    name: "Mobilising Others",
    area: "Resources",
    hint: "Inspire, engage and get others on board.",
    description: "Inspire and enthuse relevant stakeholders. Get the support needed to achieve valuable outcomes. Demonstrate effective communication, persuasion, negotiation and leadership ",
    threads: [
      {
        id: "mo_inspire",
        title: "Inspire and get inspired",
        levels: {
          1: "I show enthusiasm for challenges. ",
          2: "I am actively involved in creating value for others.",
          3: "I do not get discouraged by difficulties.",
          4: "I can lead by example.",
          5: "I can get endorsement from others to support my value-creating activity.",
          6: "I can inspire others, despite challenging circumstances.",
          7: "I can maintain momentum with my team, partners and stakeholders when involved in a challenging situation.",
          8: "I can form coalitions to turn into action."
        }
      },
      {
        id: "mo_persuade",
        title: "Persuade",
        levels: {
          2: "I can persuade others by providing a number of arguments.",
          3: "I can persuade others by providing evidence for my arguments.",
          4: "I can persuade others by appealing to their emotions.",
          5: "I can pitch effectively in front of potential investors or donors.",
          6: "I can overcome resistance from those who will be affected by my (or my (team's) vision, innovative approach and value creating activity.",
          7: "I can create a call to action that gets internal stakeholders on board, such as coworkers, partners, employees or senior managers.",
          8: "I can negotiate support for ideas for creating value."
        }
      },
      {
        id: "mo_communicate",
        title: "Communicate effectively",
        levels: {
          1: "I can communicate my ideas clearly to others.",
          2: "I can communicate my team's ideas to others persuasively by using different methods (for example, posters, videos, role-play).",
          3: "I can communicate imaginative design solutions.",
          4: "I can communicate the value of my (or my team's) idea to stakeholders from different backgrounds effectively.",
          5: "I can communicate the vision for my (or my team's) venture in a way that inspires and persuades external groups, such as funders, partner organisations, volunteers, new members and affiliate supporters.",
          6: "I can produce narratives and scenarios that motivate, inspire and direct people.",
          7: "I can take part in constructive discussions with the community that my idea is targeted at.",
          8: "I can get all relevant stakeholders to take responsibility to act on an opportunity for value creation."
        }
      },
      {
        id: "mo_media",
        title: "Use media effectively",
        levels: {
          1: "I can provide examples of inspiring communication campaigns.",
          2: "I can discuss how different media can be used to reach audiences in different ways.",
          3: "I can use various methods, including social media, to communicate value-creating ideas effectively.",
          4: "I can use media appropriately, showing that I am aware of my audience and purpose.",
          5: "I can influence opinions in relation to my value-creating activity, through a planned approach to social media.",
          6: "I can design effective social media campaigns to mobilise people in relation to my (or my team’s) value creating activity.",
          7: "I can define a communication strategy to mobilise people in relation to my (or my team’s) value creating activity.",
          8: "I can sustain and increase the support for my vision."
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