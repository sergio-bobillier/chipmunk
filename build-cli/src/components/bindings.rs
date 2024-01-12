use super::Component;

const COMPONENT_NAME:&str = "Bindings";

pub struct Bindings {}

impl Bindings {
  pub fn clean(&self) {
    // Bindings knows how to clear itself
  }
}

impl Component for Bindings {
  fn new() -> Self {
    Self {}
  }

  fn name(&self) -> &str {
    COMPONENT_NAME
  }
}
