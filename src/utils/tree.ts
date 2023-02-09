export interface TreeRoot {
  segment: null;
  children: TreeNode[];
}
export interface TreeNode {
  label: string;
  fqdn: string;
  count: number;
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
  path: string[] = []
): void => {
  const segments = hostnameToSegments(hostname);
  const lastPart = segments.pop();

  if (!lastPart) {
    return;
  }

  path.unshift(lastPart);

  console.log("lastPart", lastPart, hostname);

  let next = node.children.find((child) => child.label === lastPart);

  if (next) {
    next.count += 1;
  } else {
    const newNode: TreeNode = {
      label: lastPart,
      fqdn: path.join("."),
      count: 1,
      children: [],
    };
    next = newNode;
    node.children.push(newNode);
  }

  addHostname(next, segments, path);
};
