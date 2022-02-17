#!/usr/bin/env node
const shell = require('shelljs')
const colors = require('colors')
const fs = require('fs')
const templates = require('./templates/templates.js')

const appName = process.argv[2]
const appDirectory = `${process.cwd()}/${appName}`

const run = async () => {
  const success = await createExpressApp()
  if (!success) {
    console.log('Something went wrong while trying to create a new Express app using generate-express-rest-api'.red)
    return false;
  }
  await cdIntoNewApp()
  await createPackageJSON()
  await installPackages()
  await updateTemplates()
  console.log("All done")
}

const createExpressApp = async () => {
  return new Promise((resolve) => {
    if (appName) {
      fs.mkdir(appDirectory, (err) => {
        if (err) { return console.log(err) }
        console.log("Created Express app")
        resolve(true)
      })
    } else {
      console.log("\nNo app name was provided.".red)
      console.log("\nProvide an app name in the following format: ")
      console.log("\ngenerate-express-rest-api ", "app-name\n".cyan)
      resolve(false)
    }
  })
}

const cdIntoNewApp = () => {
  return new Promise((resolve) => {
    shell.cd(appDirectory)
    resolve()
  })
}

const createPackageJSON = () => {
  return new Promise((resolve) => {
    fs.writeFile(`${appDirectory}/package.json`, require("./templates/package.json.js"), (err) => {
      if (err) { return console.log(err) }
      resolve()
    })
  })
}

const installPackages = () => {
  return new Promise(resolve => {
    console.log("\nInstalling express, mongodb, mongoose, cookie-parser, dotenv, bcrypt, jsonwebtoken, cors, morgan, helmet, nodemon\n".cyan)
    shell.exec(`npm install --save express mongodb mongoose cookie-parser dotenv bcrypt jsonwebtoken cors morgan helmet && npm install --save-dev nodemon`, () => {
      console.log("\nFinished installing packages\n".green)
      resolve()
    })
  })
}

const updateTemplates = () => {
  return new Promise(resolve => {
    const promises = []
    Object.keys(templates).forEach((fileName, i) => {
      promises[i] = new Promise(res => {
        if (typeof templates[fileName] === "object") {
          fs.mkdir(`${appDirectory}/${fileName}`, (err) => {
            if (err) { return console.log(err) }
            Object.keys(templates[fileName]).forEach((file) => {
              fs.writeFile(`${appDirectory}/${fileName}/${file}`, templates[fileName][file], (err) => {
                if (err) { return console.log(err) }
                res()
              })
            })
          })
        } else {
          fs.writeFile(`${appDirectory}/${fileName}`, templates[fileName], (err) => {
            if (err) { return console.log(err) }
            res()
          })
        }
      })
    })
    Promise.all(promises).then(() => { resolve() })
  })
}

run()
