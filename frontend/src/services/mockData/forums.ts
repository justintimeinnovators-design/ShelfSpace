import { Forum, ForumThread } from "@/types/forums";

export const mockForums: Forum[] = [
  {
    id: "1",
    name: "Classic Literature Enthusiasts",
    description: "A community for lovers of classic literature, from Shakespeare to modern classics. Share your thoughts on timeless works.",
    memberCount: 1247,
    threadCount: 89,
    isPublic: true,
    isJoined: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
    createdBy: "literature_lover_42",
    tags: ["classic-literature", "shakespeare", "dickens", "discussion"],
    featuredBooks: ["1", "2", "3"]
  },
  {
    id: "2",
    name: "Sci-Fi & Fantasy Readers",
    description: "Explore the vast universes of science fiction and fantasy. From space operas to epic quests, we discuss it all.",
    memberCount: 2156,
    threadCount: 156,
    isPublic: true,
    isJoined: false,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-19T00:00:00Z",
    createdBy: "space_explorer_7",
    tags: ["science-fiction", "fantasy", "space-opera", "magic"],
    featuredBooks: ["4", "5", "6"]
  },
  {
    id: "3",
    name: "Mystery & Thriller Club",
    description: "For fans of suspense, mystery, and psychological thrillers. Can you solve the case before the detective?",
    memberCount: 892,
    threadCount: 67,
    isPublic: true,
    isJoined: true,
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
    createdBy: "detective_reader",
    tags: ["mystery", "thriller", "suspense", "crime"],
    featuredBooks: ["7", "8", "9"]
  },
  {
    id: "4",
    name: "Non-Fiction Book Club",
    description: "Expand your knowledge with biographies, history, science, and self-improvement books.",
    memberCount: 634,
    threadCount: 45,
    isPublic: true,
    isJoined: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-17T00:00:00Z",
    createdBy: "knowledge_seeker",
    tags: ["non-fiction", "biography", "history", "self-improvement"],
    featuredBooks: ["10", "11", "12"]
  },
  {
    id: "5",
    name: "Poetry & Short Stories",
    description: "A intimate group for lovers of poetry and short fiction. Share your favorite verses and discover new voices.",
    memberCount: 423,
    threadCount: 78,
    isPublic: true,
    isJoined: true,
    createdAt: "2023-12-20T00:00:00Z",
    updatedAt: "2024-01-16T00:00:00Z",
    createdBy: "poetry_lover_19",
    tags: ["poetry", "short-stories", "literature", "creative-writing"],
    featuredBooks: ["13", "14", "15"]
  }
];

export const mockForumThreads: ForumThread[] = [
  {
    id: "1",
    forumId: "1",
    title: "What's your favorite Shakespeare play?",
    content: "I've been reading through Shakespeare's works and I'm curious about everyone's favorite play. Mine is definitely Hamlet - the soliloquies are incredible!",
    authorId: "shakespeare_fan_42",
    authorName: "John Smith",
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z",
    replies: [
      {
        id: "1",
        threadId: "1",
        content: "I love Macbeth! The psychological depth and the way Shakespeare explores ambition is fascinating.",
        authorId: "bard_lover_99",
        authorName: "Maria Garcia",
        createdAt: "2024-01-20T09:30:00Z",
        likes: 5
      },
      {
        id: "2",
        threadId: "1",
        content: "Romeo and Juliet for me - tragic but beautiful. The language is so poetic.",
        authorId: "romance_reader_23",
        authorName: "Tom Wilson",
        createdAt: "2024-01-20T10:15:00Z",
        likes: 3
      }
    ],
    likes: 12,
    isPinned: true,
    isLocked: false
  },
  {
    id: "2",
    forumId: "2",
    title: "Best space opera series recommendations?",
    content: "I'm looking for some epic space opera series to dive into. I've read Dune and Foundation, what else should I check out?",
    authorId: "space_cadet_88",
    authorName: "Alex Rivera",
    createdAt: "2024-01-19T14:00:00Z",
    updatedAt: "2024-01-19T14:00:00Z",
    replies: [
      {
        id: "3",
        threadId: "2",
        content: "The Expanse series by James S.A. Corey is fantastic! Great character development and realistic physics.",
        authorId: "sci_fi_expert_55",
        authorName: "Sarah Chen",
        createdAt: "2024-01-19T15:20:00Z",
        likes: 8
      }
    ],
    likes: 7,
    isPinned: false,
    isLocked: false
  }
];

/**
 * Generate Mock Forums.
 * @returns Forum[].
 */
export const generateMockForums = (): Forum[] => mockForums;
