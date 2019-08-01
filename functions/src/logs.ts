/*
 * Copyright 2019 Pascal Luther
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import config from './config'

const obfuscatedConfig = {
  ...config,
  sendgridApiKey: '********'
}

export const init = () => {
  // TODO: Rename 000 to you-know-what.
  console.log('Initializing 000 with configuration.', obfuscatedConfig)
}

export const start = () => {
  console.log('Started 000 execution with configuration', obfuscatedConfig)
}

export const complete = () => {
  console.log('Completed 000 execution')
}

// Auth

export const userUnauthenticated = () => {
  console.warn('Unable to delete, the user is unauthenticated')
}

export const userMissingClaim = () => {
  console.warn(
    "Unable to delete, the user does not have the 'deleteAllAuthUsers' custom claim"
  )
}

// Errors

export const errorListAndDeleteUsers = (err: Error) => {
  console.error(
    'Internal error when calling listAndDeleteAllAuthenticationUsers().',
    err
  )
}

export const errorCouldNotListUsers = () => {
  console.log('Error when calling admin.auth().listUsers()')
}

export const errorCouldNotDeleteUser = (userId: string, err: Error) => {
  console.error(`Failed deleting user with uid: ${userId}`, err)
}

// Successes

export const deletionSuccessful = (userId: string) => {
  console.log(`Successfully deleted auth user with uid: ${userId}`)
}
