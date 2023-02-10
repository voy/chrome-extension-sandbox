import {
  addHostname,
  createTree,
  getJunctionSegments,
  getTabGroups,
} from "../utils/tree";

const tree = createTree();
// addHostname(tree, "www.google.com");
// addHostname(tree, "calendar.google.com");
// addHostname(tree, "mail.google.com");
// addHostname(tree, "www1.mail.google.com");
// addHostname(tree, "www2.mail.google.com");
// addHostname(tree, "max.af.czu.edu.cz", {} as any);
// addHostname(tree, "max.af.czu.edu.cz", {} as any);
// addHostname(tree, "www.czu.edu.cz", {} as any);
// addHostname(tree, "czu.edu.cz", {} as any);
// addHostname(tree, "www.af.czu.edu.cz", {} as any);

addHostname(tree, "cvut.cz", {} as any);
addHostname(tree, "fit.cvut.cz", {} as any);
addHostname(tree, "courses.fit.cvut.cz", {} as any);

console.log(JSON.stringify(tree, null, 2));

// console.log(splitHostname("www.google.com"));
// console.log(splitHostname("max.af.czu.cz"));
// console.log(splitHostname("czu.cz"));
// console.log(splitHostname("localhost"));

console.log(getJunctionSegments(tree, "courses.fit.cvut.cz"));
