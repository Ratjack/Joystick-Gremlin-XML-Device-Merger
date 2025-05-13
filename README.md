# Joystick Gremlin XML Device Merger

**Joystick Gremlin XML Device Merger** is a simple utility that helps you merge VKB device definitions (like SEM, THQ, etc.) into existing Joystick Gremlin profile XML files.

** Note

This works best if your SEM is setup as a separate virtual controller.  To see how you can setup your SEM a virtual controller see the following YouTube video. https://www.youtube.com/watch?v=0VM-OoXhYvs&t=94s.  Alternatively I have included my saved CFG for my right stick where the SEM has been separated into a virtual device.

It allows you to:
- View all available XML files in your folder
- Select a source XML file that contains the VKB device you want to copy
- Select a target XML profile to inject that device into
- Preview all detected devices (with name, GUID, and number of control containers)
- Write a clean merged XML file to use in Joystick Gremlin

---

## ⚙️ How It Works

When you launch the tool:
1. It lists all `.xml` files in the current folder
2. You choose a **source file** (containing the VKB device)
3. You choose a **target file** (usually your Gremlin profile)
4. You select which device to insert
5. A new file is created with ` (merged)` added to the filename

---

## 📁 File Requirements

- Both the **source** and **target** `.xml` files **must be in the same folder** as this program.
- The program will only detect `.xml` files in the launch directory.
- Output files will also be written to the same folder.

---

## Use With Subliminal's VKB profile

-Place your Joystick Gremlin profile or previously used one with your device in the folder
-Place Subliminals Joystick Gremlin profile in the folder
-Run and select the source and target to bring your device in.
-If updating to a newly release profile, just load in your old one along with the newly release.

## 📦 Installation

If you're running the **.exe version**:
- Just place it in the folder with your XML files and double-click it.

If you're using **Node.js**:
1. Clone or download this repo
2. Install dependencies:

   ```bash
   npm install
