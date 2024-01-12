use clap::{Parser, Subcommand};
use termion::color;

mod components;
mod errors;
mod commands;

use commands::Clean;
use commands::Command;

fn print_error(message: String) {
    println!("{}ERROR:{} {}", color::Fg(color::LightRed), color::Fg(color::Reset), message);
}

#[derive(Subcommand)]
enum Subcommands {
    // Clean-up commands
    Clean {
        component_name: String
    }
}

#[derive(Parser)]
#[command(version, about = "Chipmunk's Build Tool")]
struct CommandLineOptions {
    #[command(subcommand)]
    command: Subcommands
}

fn main() {
    let command_line = CommandLineOptions::parse();

    let result = match &command_line.command {
        Subcommands::Clean { component_name } => {
            Clean::new(component_name.to_string())
        }
    };

    match result {
        Ok(command) => {
            command.run()
        },
        Err(error) => {
            print_error(format!("{}", error));
        }
    }
}
