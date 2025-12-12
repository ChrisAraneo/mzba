name := "server"

version := "0.1.0-SNAPSHOT"

scalaVersion := "2.12.21"

libraryDependencies ++= Seq(
  "org.apache.pekko" %% "pekko-http" % "1.0.1",
  "org.apache.pekko" %% "pekko-stream" % "1.0.3",
  "org.scalatest" %% "scalatest" % "3.2.17" % Test
)

scalacOptions ++= Seq(
  "-deprecation",
  "-encoding", "UTF-8",
  "-feature",
  "-unchecked"
)
