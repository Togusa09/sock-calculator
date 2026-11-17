import {
  Children,
  isValidElement,
  useCallback,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type WizardStepInfo = {
  id: string;
  label: string;
  index: number;
};

export type WizardDestination =
  { type: "step"; step: WizardStepInfo } | { type: "finish" };

type WizardStepProps = {
  id: string;
  label: string;
  component: ReactElement;
};

type WizardProps = {
  children: ReactNode;
  canAdvance?: (
    current: WizardStepInfo,
    destination: WizardDestination,
  ) => boolean;
  onFinish?: () => void;
};

export function WizardStep(_props: WizardStepProps) {
  return null;
}

function getSteps(children: ReactNode): WizardStepProps[] {
  const ids = new Set<string>();
  const steps = Children.toArray(children).map((child) => {
    if (!isValidElement<WizardStepProps>(child) || child.type !== WizardStep) {
      throw new Error("Wizard children must be WizardStep elements.");
    }

    const { id, label, component } = child.props;
    if (
      typeof id !== "string" ||
      id.trim() === "" ||
      ids.has(id) ||
      typeof label !== "string" ||
      label.trim() === "" ||
      !isValidElement(component)
    ) {
      throw new Error(
        "Each WizardStep needs a unique nonempty id, a label, and a React element.",
      );
    }
    ids.add(id);
    return { id, label, component };
  });

  if (steps.length === 0) {
    throw new Error("Wizard requires at least one WizardStep.");
  }
  return steps;
}

function createSwipeResponder(onSwipe: (direction: number) => void) {
  let multiTouch = false;
  return PanResponder.create({
    onMoveShouldSetPanResponder: (_event, gesture) =>
      gesture.numberActiveTouches === 1 &&
      Math.abs(gesture.dx) > 12 &&
      Math.abs(gesture.dx) > Math.abs(gesture.dy) * 2,
    onPanResponderGrant: () => {
      multiTouch = false;
    },
    onPanResponderStart: (_event, gesture) => {
      if (gesture.numberActiveTouches > 1) {
        multiTouch = true;
      }
    },
    onPanResponderMove: (_event, gesture) => {
      if (gesture.numberActiveTouches > 1) {
        multiTouch = true;
      }
    },
    onPanResponderRelease: (_event, gesture) => {
      if (
        !multiTouch &&
        Math.abs(gesture.dx) >= 50 &&
        Math.abs(gesture.dx) > Math.abs(gesture.dy) * 2
      ) {
        onSwipe(gesture.dx < 0 ? 1 : -1);
      }
    },
  });
}

export function Wizard({ children, canAdvance, onFinish }: WizardProps) {
  const steps = useMemo(() => getSteps(children), [children]);
  const [initialIds] = useState(() => steps.map((step) => step.id));
  if (
    initialIds.length !== steps.length ||
    initialIds.some((id, index) => id !== steps[index].id)
  ) {
    throw new Error("Wizard step ids and their order must remain stable.");
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [furthestIndex, setFurthestIndex] = useState(0);

  const stepInfo = useCallback(
    (index: number): WizardStepInfo => ({
      id: steps[index].id,
      label: steps[index].label,
      index,
    }),
    [steps],
  );

  const navigate = useCallback(
    (index: number) => {
      if (index < 0 || index >= steps.length || index === activeIndex) {
        return;
      }
      if (
        index > activeIndex &&
        canAdvance &&
        !canAdvance(stepInfo(activeIndex), {
          type: "step",
          step: stepInfo(index),
        })
      ) {
        return;
      }
      setActiveIndex(index);
      setFurthestIndex((previous) => Math.max(previous, index));
    },
    [activeIndex, canAdvance, stepInfo, steps.length],
  );

  function finish() {
    if (
      onFinish &&
      (!canAdvance || canAdvance(stepInfo(activeIndex), { type: "finish" }))
    ) {
      onFinish();
    }
  }

  const panResponder = useMemo(
    () =>
      createSwipeResponder((direction) => navigate(activeIndex + direction)),
    [activeIndex, navigate],
  );

  return (
    <View style={styles.wizard}>
      <Text accessibilityLiveRegion="polite">
        Step {activeIndex + 1} of {steps.length}: {steps[activeIndex].label}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.progress}
        accessibilityLabel="Wizard steps"
      >
        {steps.map((step, index) => {
          const disabled = index > furthestIndex;
          return (
            <Pressable
              key={step.id}
              accessibilityRole="button"
              accessibilityLabel={`Step ${index + 1}: ${step.label}`}
              accessibilityState={{ selected: index === activeIndex, disabled }}
              disabled={disabled}
              onPress={() => navigate(index)}
              style={styles.progressStep}
            >
              <Text>
                {index + 1}. {step.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View
        {...(Platform.OS === "web" ? {} : panResponder.panHandlers)}
        style={styles.content}
        testID="wizard-content"
      >
        {steps.map((step, index) => {
          const active = index === activeIndex;
          return (
            <View
              key={step.id}
              style={!active && styles.hidden}
              pointerEvents={active ? "auto" : "none"}
              accessibilityElementsHidden={!active}
              importantForAccessibility={
                active ? "auto" : "no-hide-descendants"
              }
            >
              {step.component}
            </View>
          );
        })}
      </View>

      <View style={styles.navigation}>
        {activeIndex > 0 ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => navigate(activeIndex - 1)}
            style={styles.control}
          >
            <Text>Back</Text>
          </Pressable>
        ) : (
          <View />
        )}
        {activeIndex < steps.length - 1 ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => navigate(activeIndex + 1)}
            style={styles.control}
          >
            <Text>Next</Text>
          </Pressable>
        ) : (
          onFinish && (
            <Pressable
              accessibilityRole="button"
              onPress={finish}
              style={styles.control}
            >
              <Text>Finish</Text>
            </Pressable>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wizard: {
    gap: 12,
  },
  progress: {
    flexDirection: "row",
    gap: 8,
  },
  progressStep: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    // A border or background can distinguish the selected step.
  },
  content: {
    // A background or border can frame the active step.
  },
  hidden: {
    display: "none",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  control: {
    padding: 8,
    // Add button borders or backgrounds here.
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
});
