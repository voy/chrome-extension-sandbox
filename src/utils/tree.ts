export interface TreeRoot {
  segment: null;
  children: TreeNode[];
}
export interface TreeNode {
  label: string;
  fqdn: string;
  tabs: chrome.tabs.Tab[];
  children: TreeNode[];
}

type HostnameSegments = string[];
type Hostname = string | HostnameSegments;

export const createTree = (): TreeRoot => ({ segment: null, children: [] });

export const splitHostname = (hostname: string): string[] => {
  const parts = hostname.split(".");
  const [tld, domain, ...rest] = parts.reverse();

  if (domain && tld) {
    return [`${domain}.${tld}`, ...rest].reverse();
  }

  return [hostname];
};

const hostnameToSegments = (hostname: Hostname): HostnameSegments => {
  return typeof hostname === "string" ? splitHostname(hostname) : hostname;
};

export const addHostname = (
  node: TreeRoot | TreeNode,
  hostname: Hostname,
  tab: chrome.tabs.Tab,
  path: string[] = []
): void => {
  const segments = hostnameToSegments(hostname);
  const lastPart = segments.pop();

  if (!lastPart) {
    return;
  }

  path.unshift(lastPart);

  let next = node.children.find((child) => child.label === lastPart);

  if (next) {
    next.tabs.push(tab);
  } else {
    const newNode: TreeNode = {
      label: lastPart,
      fqdn: path.join("."),
      tabs: [tab],
      children: [],
    };
    next = newNode;
    node.children.push(newNode);
  }

  addHostname(next, segments, tab, path);
};

export const getFqdnPath = (tree: TreeRoot, hostname: string): TreeNode[] => {
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

export interface JunctionSegment {
  label: string;
  fqdn: string;
}

export const getJunctionSegments = (
  tree: TreeRoot,
  hostname: string
): JunctionSegment[] => {
  const path = getFqdnPath(tree, hostname);
  const junctionSegments: JunctionSegment[] = [];
  const buffer: JunctionSegment[] = [];

  const reduceBuffer = (): JunctionSegment => {
    return {
      label: buffer.map((segment) => segment.label).join("."),
      fqdn: buffer[0].fqdn,
    };
  };

  for (const pathNode of path) {
    if (pathNode.children.length > 1) {
      junctionSegments.push(reduceBuffer());
      buffer.length = 0;
    }

    if (!pathNode.label) {
      continue;
    }

    buffer.push({ label: pathNode.label, fqdn: pathNode.fqdn });
  }

  junctionSegments.push(reduceBuffer());

  return junctionSegments;
};

export const getTabGroups = (tree: TreeRoot): Map<string, number> => {
  const leafNodes: TreeNode[] = [];
  const queue = [...tree.children];

  while (queue.length > 0) {
    const node = queue.shift();

    if (!node) {
      continue;
    }

    // add another condition to check if the node is a leaf node
    if (node.children.length === 0) {
      leafNodes.push(node);
    } else {
      queue.push(...node.children);
    }
  }

  return new Map(leafNodes.map((node) => [node.fqdn, node.tabs.length]));
};
