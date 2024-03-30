import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs'
import { promises as fsPromises } from 'fs'
import * as path from 'path'

@Injectable()
// extending console logger so we can add our custom logic to the default console logger.
export class CustomLoggerService extends ConsoleLogger {
    // a function that generates a 'logs' folder+file if it doesn't exist and writes a line of text to a file with sole additional info
    async logToFile(entry){
      const formattedEntry = `${Intl.DateTimeFormat('en-US', {
          dateStyle: 'short',
          timeStyle: 'short',
          timeZone: 'America/Chicago',
      }).format(new Date())}\t${entry}\n`
  
      try {
          if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))){
              await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'))
          }
          await fsPromises.appendFile(path.join(__dirname, '..', '..', 'logs', 'myLogFile.log'), formattedEntry)
      } catch (e) {
          if (e instanceof Error) console.error(e.message)
      }
    }

    // log function is executed when we log a message
    // log function takes 1 mandatory param: message & other optional params(see logging docs)
    log(message: any, context?: string) {
      // storing the message and context in a variable called 'entry'
      const entry = `${context}\t${message}`
  
      // custom logic goes here...
      this.logToFile(entry)
  
      // override log method
      super.log(message, context)
    }
    // error function is executed when we the application encounters an error
    // error function takes 1 mandatory param: message & other optional params(see logging docs)
    error(message: any, stackOrContext?: string) {
      // storing the message and context in a variable called 'entry'
      const entry = `${stackOrContext}\t${message}`
  
      // custom logic goes here...
      this.logToFile(entry)
  
      // override log method
      super.error(message, stackOrContext)
    }
}
