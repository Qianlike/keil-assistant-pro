# Keil Assistant 2026

[marketplace](https://marketplace.visualstudio.com/items?itemName=WTL568594290.keil-assistant-2026)
### Fork from [keil-assistant](https://github.com/github0null/keil-assistant)
Due to the original plugin no longer being updated and encountering some issues during use, the project was forked and some modifications were made for ease of use.
- When adding a project, you can choose to generate the path *of the generated c_cpp_properties. json file relative to the keil uvproj file, which was previously generated in the directory where the uvproj file is located*
- Remember the path to the keil uvproj file, and use this path to open the keil project when opening any file. *The dialog box for adding a project originally defaults to the path where the current open file is located*
- Add two C51 snippets to prevent interrupt x errors
  - isr interrupt handler function
  - INTERRUPT interrupt vector macro

`vsce package`

## Summary 📑

Keil assistive tool on VScode, used with C/C++ plug-in.

It provides syntax highlighting, code snippets for Keil projects, and supports compiling and downloading Keil projects.

**Keil uVison 5 and above is supported only**  

**Windows platform only**

![preview](./res/preview/preview.png)

***

## Features 🎉

- Load the Keil C51/ARM project and display the project view as the Keil project style
- Automatically monitor keil project files for changes and keep project views up to date
- Compile, recompile, and burn Keil projects by calling the Keil command-line interface
- Automatically generate c_cpp_property.json for C/C++ plug-in

***

## Usage 📖

### Preparatory work

1. Install the C/C++ plug-in
>
2. Go to the Keil Assistant 2026 plug-in Settings and set the absolute path of the Keil executable uv4.exe
 
 ![setting](./res/preview/setting.png)

***

### Start 🏃‍♀️

1. Create a project on Keil, add files, header path, etc
> 
2. Click **Open the Project** icon or **Use Vscode to directly open the directory where keil project file (.uvproj) is located**, and the keil project will be automatically loaded by the plug-in;
 
 ![load](./res/preview/load.png)

### Common operations

- **Compile and burn**：Three buttons are provided, one for compile, one for download, and one for recompile
 
 ![build](./res/preview/build.png)

>

- **Save and refresh**：Add/delete the source file, change and configure the project on Keil. Click **Save all** when the change is finished. The plug-in will automatically refresh the project when it detects the change of the Keil project
 
 ![keil_save_all](./res/preview/keil_save_all.png)

>

- **Open source file**：Clicking the source file will open it in preview mode, and double-clicking the source file will switch it to non-preview mode
 
 ![open_file](./res/preview/open_file.png)

>

- **Toggle the C/C++ plug-in configuration**：Click the target name to toggle between multiple C/C++ configurations
 
 ![cpp_config](./res/preview/cpp_config.png)

>

- **Switch keil Target**：Click the project toggle button to toggle between multiple Keil targets
 
 ![active_target](./res/preview/active_target.png)

>

- **Show reference**：After compilation is complete, you can expand the reference by clicking on the arrow icon for the source item (ARM project only)
 
 ![show_referance](./res/preview/ref_show.png)

***
### Others
- **C51 Interrupt Function Error**: When defining an interrupt function, you can use `void xxx_isr (void) INTERRUPT (x)` to define the interrupt function, where x is the interrupt vector number. Add two snippets, `INTERRUPT` and `ISR`,

![interrupt](./res/preview/interrupt.png)
![isr](./res/preview/isr.png)
