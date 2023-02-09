import {
  addHostname,
  createTree,
  splitHostname,
  TreeNode,
  TreeRoot,
} from "../utils/tree";

const tree = createTree();
// addHostname(tree, "www.google.com");
// addHostname(tree, "calendar.google.com");
// addHostname(tree, "mail.google.com");
// addHostname(tree, "www1.mail.google.com");
// addHostname(tree, "www2.mail.google.com");
addHostname(tree, "max.af.czu.edu.cz");
addHostname(tree, "max.af.czu.edu.cz");
addHostname(tree, "www.czu.edu.cz");
addHostname(tree, "www.af.czu.edu.cz");

console.log(JSON.stringify(tree, null, 2));

// console.log(splitHostname("www.google.com"));
// console.log(splitHostname("max.af.czu.cz"));
// console.log(splitHostname("czu.cz"));
// console.log(splitHostname("localhost"));

const getFqdnPath = (tree: TreeRoot, hostname: string): TreeNode[] => {
  const segments = splitHostname(hostname).reverse();
  const path: TreeNode[] = [];
  let searchNode: TreeNode | TreeRoot = tree;
  let segmentNode: TreeNode | undefined;

  for (const segment of segments) {
    hostname = hostname ? `${segment}.${hostname}` : segment;
    segmentNode = searchNode.children.find((child) => child.label === segment);

    if (!segmentNode) {
      return path;
    }

    path.unshift(segmentNode);
    searchNode = segmentNode;
  }

  return path;
};

const getJunctionSegments = (tree: TreeRoot, hostname: string): string[] => {
  const path = getFqdnPath(tree, hostname);
  const junctionSegments: string[] = [];
  const buffer: string[] = [];

  for (const pathNode of path) {
    if (pathNode.children.length > 1) {
      junctionSegments.push(buffer.join("."));
      buffer.length = 0;
    }

    if (!pathNode.label) {
      continue;
    }

    buffer.push(pathNode.label);
  }

  junctionSegments.push(buffer.join("."));
  return junctionSegments;
};

console.log(getJunctionSegments(tree, "max.af.czu.edu.cz"));
