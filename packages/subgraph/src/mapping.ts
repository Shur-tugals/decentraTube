import { BigInt  } from "@graphprotocol/graph-ts";
import {
  NewVideo,
  NewTip,
  NewWithdraw
} from "../generated/YourContract/YourContract";
import { 
  Video, 
  User,
  Tip,
  Withdraw 
} from "../generated/schema";

export function handleNewVideo(event: NewVideo): void {
  let userId = event.params.owner.toHex()
  let user = User.load(userId)
  if (user == null) {
    user = new User(userId)
    user.address = event.params.owner
    user.createdAt = event.block.timestamp
    user.videoCount = BigInt.fromI32(0)
    user.tipsReceivedCount = BigInt.fromI32(0)
    user.totalReceived = BigInt.fromI32(0)
    user.tipsSentCount = BigInt.fromI32(0)
    user.totalSent = BigInt.fromI32(0)
    user.withdrawCount = BigInt.fromI32(0)
    user.totalWithdrawn = BigInt.fromI32(0)
    user.balance = BigInt.fromI32(0)
  } 
  user.videoCount = user.videoCount.plus(BigInt.fromI32(1))

  let video = new Video(event.params.id.toHex())
  video.owner = userId
  video.tokenURI = event.params.tokenURI
  video.createdAt = event.block.timestamp
  video.transactionHash = event.transaction.hash.toHex()
  video.tipCount = BigInt.fromI32(0)
  video.totalTips = BigInt.fromI32(0)

  video.save()
  user.save()
}

export function handleNewTip(event: NewTip): void {
  let sendingUserId = event.params.from.toHex()
  let sendingUser = User.load(sendingUserId)
  if (sendingUser == null) {
    sendingUser = new User(sendingUserId)
    sendingUser.address = event.params.from
    sendingUser.createdAt = event.block.timestamp
    sendingUser.videoCount = BigInt.fromI32(0)
    sendingUser.tipsReceivedCount = BigInt.fromI32(0)
    sendingUser.totalReceived = BigInt.fromI32(0)
    sendingUser.tipsSentCount = BigInt.fromI32(0)
    sendingUser.totalSent = BigInt.fromI32(0)
    sendingUser.withdrawCount = BigInt.fromI32(0)
    sendingUser.totalWithdrawn = BigInt.fromI32(0)
    sendingUser.balance = BigInt.fromI32(0)
  }
  sendingUser.tipsSentCount = sendingUser.tipsSentCount.plus(BigInt.fromI32(1))
  sendingUser.totalSent = sendingUser.totalSent.plus(event.params.amount)

  let receivingUserId = event.params.to.toHex()
  if (receivingUserId == sendingUserId) {
    sendingUser.tipsReceivedCount = sendingUser.tipsReceivedCount.plus(BigInt.fromI32(1))
    sendingUser.totalReceived = sendingUser.totalReceived.plus(event.params.amount)
    sendingUser.balance = sendingUser.balance.plus(event.params.amount)
  }
  let receivingUser = User.load(receivingUserId)
  if (receivingUser == null) {
    receivingUser = new User(receivingUserId)
    receivingUser.address = event.params.to
    receivingUser.createdAt = event.block.timestamp
    receivingUser.createdAt = event.block.timestamp
    receivingUser.videoCount = BigInt.fromI32(0)
    receivingUser.tipsReceivedCount = BigInt.fromI32(0)
    receivingUser.totalReceived = BigInt.fromI32(0)
    receivingUser.tipsSentCount = BigInt.fromI32(0)
    receivingUser.totalSent = BigInt.fromI32(0)
    receivingUser.withdrawCount = BigInt.fromI32(0)
    receivingUser.totalWithdrawn = BigInt.fromI32(0)
    receivingUser.balance = BigInt.fromI32(0)
  }
  receivingUser.tipsReceivedCount = receivingUser.tipsReceivedCount.plus(BigInt.fromI32(1))
  receivingUser.totalReceived = receivingUser.totalReceived.plus(event.params.amount)
  receivingUser.balance = receivingUser.balance.plus(event.params.amount)
  
  let videoId = event.params.tokenId.toHex()
  let video = Video.load(videoId)
  if (video == null) {
    video = new Video(videoId)
    video.owner = receivingUserId
    video.createdAt = event.block.timestamp
    video.transactionHash = event.transaction.hash.toHex()
    video.tipCount = BigInt.fromI32(0)
    video.totalTips = BigInt.fromI32(0)
  }
  video.tipCount = video.tipCount.plus(BigInt.fromI32(1))
  video.totalTips = video.totalTips.plus(event.params.amount)

  let tip = new Tip(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  tip.from = sendingUserId
  tip.to = receivingUserId
  tip.video = videoId
  tip.amount = event.params.amount
  tip.createdAt = event.block.timestamp
  tip.transactionHash = event.transaction.hash.toHex()

  tip.save()
  video.save()
  receivingUser.save()
  sendingUser.save()
}

export function handleNewWithdraw(event: NewWithdraw): void {
  let userId = event.params.user.toHex()
  let user = User.load(userId)
  if (user == null) {
    user = new User(userId)
    user.address = event.params.user
    user.createdAt = event.block.timestamp
    user.videoCount = BigInt.fromI32(0)
    user.tipsReceivedCount = BigInt.fromI32(0)
    user.totalReceived = BigInt.fromI32(0)
    user.tipsSentCount = BigInt.fromI32(0)
    user.totalSent = BigInt.fromI32(0)
    user.withdrawCount = BigInt.fromI32(0)
    user.totalWithdrawn = BigInt.fromI32(0)
    user.balance = BigInt.fromI32(0)
  }
  user.withdrawCount = user.withdrawCount.plus(BigInt.fromI32(1))
  user.totalWithdrawn = user.totalWithdrawn.plus(event.params.amount)
  user.balance = user.balance.minus(event.params.amount)

  let withdraw = new Withdraw(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  withdraw.user = userId
  withdraw.amount = event.params.amount
  withdraw.createdAt = event.block.timestamp
  withdraw.transactionHash = event.transaction.hash.toHex()

  withdraw.save()
  user.save()
}