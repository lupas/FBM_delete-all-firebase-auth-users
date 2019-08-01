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

import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as assertions from './assertions'
import * as httpErrors from './errors'
import * as logs from './logs'

admin.initializeApp()
logs.init()

export const deleteAllAuthenticationUsers = functions.https.onCall(
  async (data, context) => {
    logs.start()

    const { auth } = context
    assertions.userIsAuthenticated(auth)

    const { token } = auth
    assertions.userHasClaim(token)

    try {
      await listAndDeleteAllAuthenticationUsers()
    } catch (err) {
      logs.errorListAndDeleteUsers(err)
      throw httpErrors.internal(err)
    }

    logs.complete()
    return { success: true }
  }
)

const listAndDeleteAllAuthenticationUsers = async (nextPageToken?: string) => {
  // List batch of users, 1000 at a time.

  let listUsersResult
  try {
    if (nextPageToken) {
      listUsersResult = await admin.auth().listUsers(1000, nextPageToken)
    } else {
      listUsersResult = await admin.auth().listUsers(1000)
    }
  } catch (err) {
    logs.errorCouldNotListUsers()
    throw httpErrors.internal(err)
  }

  for (let userRecord of listUsersResult.users) {
    try {
      await admin.auth().deleteUser(userRecord.uid)
    } catch (err) {
      logs.errorCouldNotDeleteUser(userRecord.uid, err)
      // Nevertheless continue with deletion
    }
  }
  if (listUsersResult.pageToken) {
    // List next batch of users.
    // Wait because of timeout needed between two listUser requests.
    setTimeout(
      this.listAndDeleteAllAuthenticationUsers(listUsersResult.pageToken),
      2000
    )
  }
}
