import React, { useState } from "react";
import { initalStructure } from "./Data";
import {
  findNodeById,
  getParentNode,
  findParentNodeById,
  updateParentId,
  updateParentIdOutdent,
  increaseIdentLevel,
  decreaseIdentLevel,
  countNodes,
  updateParentIdOfChild,
  downloadJSON
} from "./Utils";

const App = () => {
  const [curriculumData, setCurriculumData] = useState(initalStructure);

  const addTopic = () => {
    let newId = countNodes(curriculumData);

    setCurriculumData([
      ...curriculumData,
      {
        id: newId + 1,
        text: `Topic ${newId + 1}`,
        identLevel: 1,
        parent: "root",
        children: []
      }
    ]);
  };

  const handleTextChange = (event, nodeId) => {
    setCurriculumData((prevState) => {
      const newData = [...prevState];
      const node = findNodeById(newData, nodeId);
      node.text = event.target.value;
      return newData;
    });
  };

  const handleIndent = (node, identLevel) => {
    let newData = [...curriculumData];
    const parent = findParentNodeById(newData, node.id, identLevel);
    if (parent) {
      let siblingIndex = parent.children.indexOf(node);
      if (siblingIndex > 0) {
        const prevSibling = parent.children[siblingIndex - 1];
        let newnode = increaseIdentLevel(node);
        newnode = updateParentId(newnode, prevSibling);
        prevSibling.children.push(newnode);
        parent.children.splice(siblingIndex, 1);
      }
      setCurriculumData(newData);
    } else {
      let siblingIndex = newData.indexOf(node);
      let parentNode = getParentNode(newData, node);
      if (siblingIndex > 0) {
        const prevSibling = newData[siblingIndex - 1];
        let newnode = increaseIdentLevel(node);
        newnode = updateParentId(newnode, prevSibling);
        prevSibling.children.push(newnode);
        newData.splice(siblingIndex, 1);
        setCurriculumData(newData);
      } else if (parentNode) {
        let siblingIndex = parentNode.children.indexOf(node);
        let prevSibling = parentNode.children[siblingIndex - 1];
        if (prevSibling) {
          let newnode = increaseIdentLevel(node);
          newnode = updateParentId(newnode, prevSibling);
          prevSibling.children.push(newnode);
          parentNode.children.splice(siblingIndex, 1);
          setCurriculumData(newData);
        }
      }
    }
  };

  const handleOutdent = (node, identLevel) => {
    let newData = [...curriculumData];
    const parent = getParentNode(newData, node, identLevel);
    if (parent && parent.parent !== "root") {
      const grandparent = getParentNode(newData, parent, parent.identLevel - 1);
      if (grandparent) {
        let nodeIndex = parent.children.indexOf(node);
        let prevSibling = grandparent.children.indexOf(parent);
        let newNode = decreaseIdentLevel(node);
        parent.children.splice(nodeIndex, 1);
        newNode = updateParentIdOutdent(node, parent);
        grandparent.children.splice(prevSibling + 1, 0, newNode);
        setCurriculumData(newData);
      }
    } else if (parent && parent.parent === "root") {
      let siblingIndex = parent.children.indexOf(node);
      if (siblingIndex > -1) {
        let nodeIndex = parent.children.indexOf(node);
        let prevSibling = newData.indexOf(parent);
        let allNextSibling = parent.children.slice(nodeIndex + 1);
        let newNode = decreaseIdentLevel(node);
        parent.children.splice(nodeIndex);
        newNode = updateParentIdOutdent(newNode, parent);
        let newChild = updateParentIdOfChild(allNextSibling, newNode);
        newNode.children.push(...newChild);
        newData.splice(prevSibling + 1, 0, newNode);
        setCurriculumData(newData);
      } else {
        let nodeIndex = newData.indexOf(node);
        if (nodeIndex > 0) {
          newData.children = [...newData.splice(nodeIndex, 1)];
          setCurriculumData(newData);
        }
      }
    } else {
      setCurriculumData(newData);
    }
  };

  const handleDelete = (node) => {
    let newData = [...curriculumData];
    const parent = getParentNode(newData, node);
    if (parent) {
      parent.children.splice(parent.children.indexOf(node), 1);
    } else {
      newData.splice(newData.indexOf(node), 1);
    }
    setCurriculumData(newData);
  };

  const renderNode = (node) => {
    return (
      <div key={node.id} className="node">
        <div className="row" style={{ marginLeft: node.identLevel * 20 }}>
          <input
            type="text"
            value={node.text}
            onChange={(event) =>
              handleTextChange(event, node.id, node.identLevel)
            }
          />
          <button onClick={() => handleIndent(node, node.identLevel)}>
            Indent
          </button>
          <button onClick={() => handleOutdent(node, node.identLevel)}>
            Outdent
          </button>
          <button onClick={() => handleDelete(node)}>Delete</button>
        </div>
        <div className="children">
          {node.children.map((childNode) => renderNode(childNode))}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      {curriculumData.map((node) => renderNode(node))}
      <button onClick={addTopic}>Add Topic</button>
      <button onClick={() => downloadJSON(curriculumData)}>Download</button>
    </div>
  );
};

export default App;
