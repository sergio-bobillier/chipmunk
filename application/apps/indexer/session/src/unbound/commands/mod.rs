mod cancel_test;
mod folder;

use crate::events::ComputationError;

use log::trace;
use serde::{Deserialize, Serialize};
use tokio::sync::oneshot;
use uuid::Uuid;

use super::signal::Signal;

#[derive(Debug, Serialize, Deserialize)]
pub enum CommandOutcome<T> {
    Finished(T),
    Cancelled,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum UuidCommandOutcome<T: Serialize> {
    Finished((Uuid, T)),
    Cancelled(Uuid),
}

impl<T: Serialize> CommandOutcome<T> {
    pub fn as_command_result(self, uuid: Uuid) -> UuidCommandOutcome<T> {
        match self {
            CommandOutcome::Cancelled => UuidCommandOutcome::Cancelled(uuid),
            CommandOutcome::Finished(c) => UuidCommandOutcome::Finished((uuid, c)),
        }
    }
}

#[derive(Debug)]
pub enum Command {
    FolderContent(
        String,
        oneshot::Sender<Result<CommandOutcome<String>, ComputationError>>,
    ),
    CancelTest(
        i64,
        i64,
        oneshot::Sender<Result<CommandOutcome<i64>, ComputationError>>,
    ),
}

impl std::fmt::Display for Command {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                Command::CancelTest(_, _, _) => "CancelTest",
                Command::FolderContent(_, _) => "FolderContent",
            }
        )
    }
}

pub async fn process(command: Command, signal: Signal) {
    match command {
        Command::FolderContent(path, tx) => {
            trace!("process command: FolderContent");
            let res = folder::get_folder_content(&path, signal);
            trace!("done with command: FolderContent, sending back results");
            let _ = tx.send(res);
        }
        Command::CancelTest(a, b, tx) => {
            let _ = tx.send(cancel_test::cancel_test(a, b, signal).await);
        }
    }
}
