mod bindings;

pub mod cleanable;

trait Component {
  fn new() -> Self;
  fn name(&self) -> &str;
}
