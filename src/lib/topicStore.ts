// src/lib/topicStore.ts

import { SynthesizedTopic } from "@/lib/agents/knowledgeSynthesizer";
import { v4 as uuidv4 } from "uuid";

export type TopicEntry = {
  id: string;
  createdAt: string;
  source?: string;
  data: SynthesizedTopic;
};

const topicBank = new Map<string, TopicEntry>();

export function saveTopic(data: SynthesizedTopic, source?: string): TopicEntry {
  const entry: TopicEntry = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    source,
    data,
  };
  topicBank.set(entry.id, entry);
  return entry;
}

export function getTopic(id: string): TopicEntry | undefined {
  return topicBank.get(id);
}

export function getAllTopics(): TopicEntry[] {
  return Array.from(topicBank.values());
}

export function clearTopicBank() {
  topicBank.clear();
}
