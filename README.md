One of the outcomes emerging from these experiments was a lightweight browser-based tool designed to expose hidden surveillance infrastructures embedded within everyday interfaces: a cookie parser bookmarklet. This tool aligns with the broader objectives of Euridice by making visible the often-opaque mechanisms of algorithmic profiling, specifically those enacted through cookie tracking and consent banners. Developed using JavaScript it parses both HTML tables and structured JSON-LD data to extract cookie metadata. While  I would argue that this approach is technically minimal, the backbone consists of the same core frameworks that the larger project Euridice would be built on later.

The practice of critical making has a long-standing presence in web development, with notable examples such as Max Krimensky’s Blackout Poetry Generator  and Kirin’s Shinigami Eyes. Following this tradition, a key objective in the development of this project was to ensure it remained open source (a link to the project's GitHub repository is provided in the appendix), lightweight, installation-free, permissionless, and non-persistent, that is, leaving no data or trace upon closure of the browser window.

Parsing is not a neutral process and is rarely designed to accommodate creative interruption. Code is often not regarded as a speculative or artistic medium, but when used in unexpected ways, it reveals its potential beyond automation. These speculative designs illustrate how browser tools can act as both interpreters and performers within interface space offering interaction with the user and further reinforcing the concept of code as a spellbook an instrument of art, imagination, and active resistance.








So what does this bookmarket do?

This bookmarklet works as a one-click interface to surface cookie tracking practices especially those buried in long policy tables or machine-readable metadata.Information should be presented in a clean, readable format that transforms complex data structures into content that can be read, interpreted and understood by humans.

Scans for cookies in both HTML and JSON-LD


Parses fields like name, purpose, provider, and duration


Outputs a readable table of cookies
Runs locally — **no data is transmitted or stored**




As an interface, further drawing on Menkman's (2011) concept of "glitch moment(um)," the interface incorporates subtle visual glitches as intentional disruptions in order to highlight the extractive nature of surveillance technologies. While the visual styling to this bookmarket is not critical to it’s functionality, I feel that keeping things light and fun helps engage users and break the “passive scrolling” “faith-based” mentality. 
