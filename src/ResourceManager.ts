import * as vscode from "vscode";
import { File } from "../lib/node_utility/File";

interface KeilLocation {
  path: string;
  root: string;
}

let _instance: ResourceManager | undefined;

const dirList: string[] = [
  File.sep + "bin",
  File.sep + "res",
  File.sep + "res" + File.sep + "icons",
];

export class ResourceManager {
  private extensionDir: File;
  private dirMap: Map<string, File>;
  private iconMap: Map<string, string>;

  private constructor(context: vscode.ExtensionContext) {
    this.extensionDir = new File(context.extensionPath);
    this.dirMap = new Map();
    this.iconMap = new Map();
    this.init();
  }

  static getInstance(context?: vscode.ExtensionContext): ResourceManager {
    if (_instance === undefined) {
      if (context) {
        _instance = new ResourceManager(context);
      } else {
        throw Error("context can't be undefined");
      }
    }
    return _instance;
  }

  private init() {
    // init dirs
    for (const path of dirList) {
      const f = new File(this.extensionDir.path + path);
      if (f.IsDir()) {
        this.dirMap.set(f.noSuffixName, f);
      }
    }

    // init icons
    const iconDir = this.dirMap.get("icons");
    if (iconDir) {
      for (const icon of iconDir.GetList([/\.svg$/i], File.EMPTY_FILTER)) {
        this.iconMap.set(icon.noSuffixName, icon.path);
      }
    }
  }

  private getConfigTarget(): vscode.ConfigurationTarget | null {
    const folders = vscode.workspace.workspaceFolders;

    // 多根工作区 → 写入 workspace
    if (folders && folders.length > 1) {
      return vscode.ConfigurationTarget.Workspace;
    }

    // 单文件夹 → 写入 folder
    if (folders && folders.length === 1) {
      return vscode.ConfigurationTarget.WorkspaceFolder;
    }

    return null;
  }

  private getAppConfig(): vscode.WorkspaceConfiguration {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
      if (workspaceFolders.length == 1) {
        const folder = workspaceFolders[0];
        return vscode.workspace.getConfiguration("KeilAssistant", folder);
      }
    }
    return vscode.workspace.getConfiguration("KeilAssistant");
  }

  getBuilderExe(): string {
    return this.dirMap.get("bin")?.path + File.sep + "Uv4Caller.exe";
  }

  getC51UV4Path(): string {
    return this.getAppConfig().get<string>("C51.Uv4Path") || "null";
  }

  getArmUV4Path(): string {
    return this.getAppConfig().get<string>("MDK.Uv4Path") || "null";
  }

  getProjectFileLocationList(): KeilLocation[] {
    // return this.getAppConfig().get<string[]>("Project.FileLocationList") || [];
    return (
      this.getAppConfig().get<KeilLocation[]>("Project.FileLocationList") || []
    );
  }

  setProjectFileLocationList(list: KeilLocation[]) {
    const target = this.getConfigTarget();
    if (target === null) {
      return;
    }
    return this.getAppConfig().update(
      "Project.FileLocationList",
      list,
      this.getConfigTarget(),
    );
  }

  // getProjectRootRelativePath(): string {
  //   return this.getAppConfig().get<string>("Project.RootRelativePath") || "";
  // }

  // setProjectRootRelativePath(path: string) {
  //   return this.getAppConfig().update(
  //     "Project.RootRelativePath",
  //     path,
  //     vscode.ConfigurationTarget.WorkspaceFolder,
  //   );
  // }

  // getProjxFilePath(): string {
  //   return this.getAppConfig().get<string>("Project.ProjxFilePath") || "";
  // }

  // setProjxFilePath(path: string) {
  //   return this.getAppConfig().update(
  //     "Project.ProjxFilePath",
  //     path,
  //     vscode.ConfigurationTarget.WorkspaceFolder,
  //   );
  // }

  getIconByName(name: string): string | undefined {
    return this.iconMap.get(name);
  }
}
