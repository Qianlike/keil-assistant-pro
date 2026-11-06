import * as fs from "fs";
import * as node_path from "path";

/**
 * Include folders contributed by the &lt;RTE&gt; block of a uVision project.
 *
 * When a project uses components from a software pack (CMSIS and friends),
 * uVision adds the component's include folders behind the scenes. They do not
 * appear in the target's &lt;IncludePath&gt;, so a project that relies on them
 * gets no such folder in `c_cpp_properties.json` and the C/C++ extension
 * cannot find headers such as `cmsis_armclang.h`.
 *
 * The pack is located the way uVision does it: a pack root holding
 * `&lt;vendor&gt;.&lt;pack&gt;.&lt;version&gt;/`, searched next to the MDK install
 * and in the CMSIS-Pack folders.
 */

interface RteComponent {
  cclass: string;
  cgroup: string;
  vendor: string;
  pack: string;
  version: string;
}

function readComponents(projectXml: string): RteComponent[] {
  const components: RteComponent[] = [];
  const block = /<RTE>([\s\S]*?)<\/RTE>/.exec(projectXml);
  if (!block) {
    return components;
  }

  const componentRe = /<component\b([^>]*)>([\s\S]*?)<\/component>/g;
  let m: RegExpExecArray | null;
  while ((m = componentRe.exec(block[1])) !== null) {
    const attrs = m[1];
    const body = m[2];
    const attr = (name: string) => {
      const r = new RegExp(`${name}="([^"]*)"`).exec(attrs);
      return r ? r[1] : "";
    };
    const pkgName = /<package\b[^>]*\bname="([^"]*)"/.exec(body);
    const pkgVendor = /<package\b[^>]*\bvendor="([^"]*)"/.exec(body);
    const pkgVersion = /<package\b[^>]*\bversion="([^"]*)"/.exec(body);

    components.push({
      cclass: attr("Cclass"),
      cgroup: attr("Cgroup"),
      vendor: (pkgVendor ? pkgVendor[1] : attr("Cvendor")).trim(),
      pack: (pkgName ? pkgName[1] : attr("Cclass")).trim(),
      version: (pkgVersion ? pkgVersion[1] : attr("Cversion")).trim(),
    });
  }
  return components;
}

/** Relative include folders a component contributes, per the pack layout */
function includeDirsOf(component: RteComponent): string[] {
  const cls = component.cclass.toUpperCase();
  const group = component.cgroup.toUpperCase();

  if (cls === "CMSIS" && group === "CORE") {
    return [node_path.join("CMSIS", "Core", "Include")];
  }
  if (cls === "CMSIS" && group === "DSP") {
    return [node_path.join("CMSIS", "DSP", "Include")];
  }
  if (cls === "CMSIS" && group === "NN") {
    return [node_path.join("CMSIS", "NN", "Include")];
  }
  return [];
}

/**
 * Locates the directory of an installed pack. Besides the CMSIS-Pack layouts
 * (`<vendor>.<pack>.<version>` and `<vendor>/<pack>/<version>`) uVision keeps
 * the packs shipped with MDK under `ARM/<pack>/<version>`, e.g.
 * `D:\keil5\ARM\CMSIS\5.9.0`.
 */
function locatePack(component: RteComponent, mdkRoot: string): string | undefined {
  const armDir = mdkRoot ? node_path.join(mdkRoot, "ARM") : "";
  const dl = [
    mdkRoot ? node_path.join(armDir, "PACK") : "",
    armDir,
    process.env.LOCALAPPDATA
      ? node_path.join(process.env.LOCALAPPDATA, "Arm", "Packs")
      : "",
  ].filter(Boolean);

  const layouts = (root: string) => [
    node_path.join(root, `${component.vendor}.${component.pack}.${component.version}`),
    node_path.join(root, component.vendor, component.pack, component.version),
    node_path.join(root, component.pack, component.version),
  ];

  for (const root of dl) {
    for (const c of layouts(root)) {
      try {
        if (fs.statSync(c).isDirectory()) {
          return c;
        }
      } catch {
        // keep looking
      }
    }
  }
  return undefined;
}

/**
 * Include folders contributed by the project's RTE components.
 *
 * @param projectXml raw contents of the .uvprojx
 * @param mdkRoot    directory that contains the ARM folder, i.e. the parent
 *                   of the UV4 directory
 */
export function rteIncludePaths(
  projectXml: string,
  mdkRoot: string
): string[] {
  const result = new Set<string>();

  for (const component of readComponents(projectXml)) {
    const packDir = locatePack(component, mdkRoot);
    if (!packDir) {
      continue;
    }
    for (const rel of includeDirsOf(component)) {
      const dir = node_path.join(packDir, rel);
      try {
        if (fs.statSync(dir).isDirectory()) {
          result.add(dir);
        }
      } catch {
        // component shipped without that folder
      }
    }
  }

  return Array.from(result);
}
