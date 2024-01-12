use crate::components::cleanable;
use crate::errors::BuildError;
use cleanable::Cleanable;

use super::Command;

pub struct Clean {
  component: Cleanable
}

impl Clean {
  pub fn new(component_name: String) -> Result<Self, BuildError> {
    let component = cleanable::Cleanable::new(component_name)?;
    Ok(Self { component })
  }
}

impl Command for Clean {
  fn run(&self) {
    // Clean the component
    self.component.clean();
  }
}
