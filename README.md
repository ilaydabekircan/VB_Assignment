---
output:
  pdf_document: default
  html_document: default
---
# VB SOFTWARE DEVELOPER ASSIGNMENT

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Features](#features)
- [Actions](#actions)
- [Code Structure](#code-structure)
- [Improvement Points](#improvement-points)
- [Challenges](#challenges)

## Introduction

This project enables dynamic manipulation of HTML DOM elements based on configurations defined in YAML files. It provides a flexible approach to web page customization by allowing users to define actions such as remove, replace, insert, and alter within YAML files. These actions are then parsed and applied to the DOM, enabling users to easily manage and update web content.

## Installation

This project was developed using Visual Studio Code with the Live Server extension to connect to a browser. The setup includes a single HTML file (index.html) that sources the js-yaml library and links to a JavaScript file. There are two YAML files, A.yaml and B.yaml, each containing different actions. The actions are separated across these files to demonstrate how multiple YAML files can be used for modularity, making it easier to scale the project with additional actions. The JavaScript file (actions.js) is responsible for loading the YAML files, applying the configurations, and handling all actions through defined functions.

## Actions

- **Remove:** Elements specified by the selectors can be removed from the DOM. For example, the configuration type: remove with selector: ".ad-banner" will remove elements with the class ad-banner.
- **Replace:** Existing elements can be replaced with new HTML content. The type: replace action with selector: "#old-header" and newElement: "<header id='new-header'>New Header</header>" will replace the element with the ID old-header with the provided new header.
- **Insert:** New elements can be inserted into the DOM at specified positions. For example, the type: insert action with position: "after" and target: "body" will insert the provided footer element after the body tag.
- **Alter:** Text content within elements can be altered. The type: alter action with oldValue: "Machine Learning" and newValue: "AI" will replace occurrences of "Machine Learning" with "AI" in the text content.

In the current implementation, actions are processed based on an assumed priority. However, this priority order is not fixed and can be adjusted as needed. Future updates to the project may involve changing this priority order to better suit different requirements or scenarios.

## Code Structure

* defaultPriority = 0

All actions in the YAML files are assigned priorities to determine their order of execution when manipulating the same parts of the browser. Each action can have a different priority to control the sequence in which they are applied. To manage this sorting, a default priority of zero is established to use later on sorting the actions.

* loadYAMLFile

This function asynchronously loads and parses the YAML files. This function fetches the file from the specified filePath, checks if the response is successful, reads the text content, and parses it into a JavaScript object using jsyaml.load(). We perform this operation asynchronously to avoid blocking the main thread, allowing other tasks to continue running while the file is being loaded. The try-catch structure is used to handle any potential errors during the fetch or parsing process. If an error occurs, it logs the error and returns null, ensuring that the application can gracefully handle issues with file loading.

* loadAndMergeConfigurations

This function loads all YAML configurations in the directory iteratively by using loadYAMLFile function and merges their contents. As each YAML file is loaded, its actions are retrieved and combined into a unified array within mergedConfig. The merged configuration is then returned, providing a complete set of actions to be executed.

* applyConfiguration

First, a condition checks if the configuration object is valid and contains a non-empty actions array. Then, actions are sorted by their priority to determine the order of execution. Sorting ensures that actions with higher priority are applied before those with lower priority. This is crucial when multiple actions target the same part of the DOM, as it guarantees that they are applied in the correct sequence. The default priority of 0 is used for actions that do not explicitly specify a priority. The try-catch block is used to handle any errors that occur during the application of actions. The switch-case structure is employed to handle different types of actions corresponding to each of their handler functions. Also, error messages are provided for unsupported action types and for any issues encountered during the application of actions.

* handleRemoveAction, handleReplaceAction, handleInsertAction, handleAlterAction

The handleRemoveAction function removes elements from the DOM based on the provided selector. The handleReplaceAction function replaces existing elements with new HTML content specified in the configuration. The handleInsertAction function inserts new elements into the DOM at a specified position relative to a target element. Finally, the handleAlterAction function updates text content within the DOM by replacing old values with new ones. Each function directly manipulates the DOM according to the type of action defined in the configuration.

* init

This function initializes the configuration process, loads and merges configurations by calling loadAndMergeConfigurations(), logs the merged configuration, and then applies the configuration to the DOM using applyConfiguration().

## Improvement Points

- Currently, merging YAML files requires manually specifying each file in an array (configFiles). Instead, we can use a data source with a tree structure that lists all YAML files to fetch and merge YAML files based on the entries in the data source, removing the need to manually update configFiles array.
- The insert action currently supports only after and before positions relative to the target element. To improve this, we could extend it to other positions based on the company's business need.
- Implementing design patterns can enhance the maintainability and scalability of the code.
- Unit tests are crucial for verifying the correctness of the code and ensuring that changes do not introduce new bugs. We can design unit tests to test a single unit of code in isolation to ensure their performance and get quick feedback.

## Challenges

- I initially focused on learning JavaScript structures suitable for YAML parsing and DOM manipulation. The challenge was to quickly become proficient in a new coding language, which required adapting to unfamiliar syntax and concepts. Despite the steep learning curve, this experience provided me valuable insights into JavaScript and its ecosystem.
- I decided to create two separate YAML files to enhance modularity rather than embedding YAML contents directly in the JavaScript file. Ensuring correct parsing and handling various data structures was challenging.
- Although it was not a major or technical challenge, effective time management was crucial to learn and apply new techniques efficiently in a short amount of time.