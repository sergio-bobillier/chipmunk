mod clean;

pub use clean::Clean;

pub trait Command {
  fn run(&self);
}
