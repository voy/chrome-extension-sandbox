import {
  addHostname,
  createTree,
  getJunctionSegments,
  splitHostname,
} from "./tree";

describe("tree", () => {
  describe("#splitHostname", () => {
    it("should split hostname three part", () => {
      const hostname = "www.google.com";
      const parts = splitHostname(hostname);
      expect(parts).toEqual(["www", "google.com"]);
    });

    it("should not split a hostname without dots", () => {
      const hostname = "localhost";
      const parts = splitHostname(hostname);
      expect(parts).toEqual(["localhost"]);
    });

    it("should split a longer hostname", () => {
      const hostname = "max.af.czu.cz";
      const parts = splitHostname(hostname);
      expect(parts).toEqual(["max", "af", "czu.cz"]);
    });
  });

  describe("#getJunctionSegments", () => {
    it("foobar", () => {
      const tree = createTree();
      addHostname(tree, "cvut.cz", {} as any);
      addHostname(tree, "courses.fit.cvut.cz", {} as any);

      let segments = getJunctionSegments(tree, "courses.fit.cvut.cz");
      expect(segments.map((s) => s.label)).toEqual(["courses.fit", "cvut.cz"]);
      addHostname(tree, "fit.cvut.cz", {} as any);

      segments = getJunctionSegments(tree, "courses.fit.cvut.cz");
      expect(segments.map((s) => s.label)).toEqual([
        "courses",
        "fit",
        "cvut.cz",
      ]);
    });

    it("baz", () => {
      const tree = createTree();
      addHostname(tree, "cvut.cz", {} as any);
      addHostname(tree, "fit.cvut.cz", {} as any);
      addHostname(tree, "courses.fit.cvut.cz", {} as any);

      const segments = getJunctionSegments(tree, "courses.fit.cvut.cz");
      expect(segments.map((s) => s.fqdn)).toEqual([
        "courses.fit.cvut.cz",
        "fit.cvut.cz",
        "cvut.cz",
      ]);
    });
  });
});
