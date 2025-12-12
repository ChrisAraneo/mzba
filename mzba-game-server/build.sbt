name := "mzba-game-server"

version := "0.1.0-SNAPSHOT"

scalaVersion := "2.12.21"

libraryDependencies ++= Seq(
  "org.scalatest" %% "scalatest" % "3.2.17" % Test
)

scalacOptions ++= Seq(
  "-deprecation",
  "-encoding", "UTF-8",
  "-feature",
  "-unchecked"
)
