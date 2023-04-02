export const findNodeById = (nodes, id, identLevel) => {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    const childNode = findNodeById(node.children, id, node.identLevel);
    if (childNode) {
      return childNode;
    }
  }
  return null;
};

export const getParentNode = (nodes, currentNode) => {
  for (const node of nodes) {
    if (node.id === currentNode.parent) return node;
    for (const childNode of node.children) {
      if (childNode.id === currentNode.parent) return childNode;
      const parentNode = getParentNode(childNode.children, currentNode);
      if (parentNode) return parentNode;
    }
  }
};

export const findParentNodeById = (nodes, id, identLevel) => {
  for (const node of nodes) {
    for (const childNode of node.children) {
      if (childNode.id === id) {
        return node;
      }
      const parentNode = findParentNodeById(
        childNode.children,
        id,
        childNode.identLevel
      );
      if (parentNode) {
        return parentNode;
      }
    }
  }
  return null;
};

export const updateParentId = (newNode, prevSibling) => {
  newNode.parent = prevSibling.id;
  for (const childNode of newNode.children) {
    updateParentId(childNode, newNode);
  }
  return newNode;
};

export const updateParentIdOutdent = (newNode, prevSibling) => {
  if (newNode.identLevel !== prevSibling.identLevel) {
    newNode.parent = prevSibling.id;
  } else {
    newNode.parent = prevSibling.parent;
  }
  for (const childNode of newNode.children) {
    updateParentIdOutdent(childNode, newNode);
  }

  return newNode;
};

export const updateParentIdOfChild = (children, parent) => {
  for (let child of children) {
    updateParentIdOutdent(child, parent);
  }
  return children;
};

export const increaseIdentLevel = (node) => {
  node.identLevel++;
  for (const childNode of node.children) {
    increaseIdentLevel(childNode);
  }
  return node;
};

export const decreaseIdentLevel = (node) => {
  node.identLevel--;
  for (const childNode of node.children) {
    decreaseIdentLevel(childNode);
  }
  return node;
};

export const countNodes = (arr) => {
  let count = 0;
  arr.forEach((obj) => {
    count++;
    if (obj.children && obj.children.length > 0) {
      count += countNodes(obj.children);
    }
  });
  return count;
};

export const downloadJSON = (curriculumData) => {
  const data = JSON.stringify(curriculumData);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = "curriculum.json";
  link.href = url;
  link.click();
};
