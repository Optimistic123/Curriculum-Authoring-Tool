export const initalStructure = [
  { id: 1, text: "Topic 1", identLevel: 1, parent: "root", children: [] },
  {
    id: 2,
    text: "Topic 2",
    identLevel: 1,
    parent: "root",
    children: [
      { id: 3, text: "topic 3", identLevel: 2, parent: 2, children: [] },
      { id: 4, text: "topic 4", identLevel: 2, parent: 2, children: [] }
    ]
  }
];
