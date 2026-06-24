from manim import *

class TrigArea(Scene):
    def construct(self):
        axes = Axes(x_range=[-PI, PI, PI / 2], y_range=[-1.5, 1.5, 1], color=WHITE)
        graph_sin = axes.plot(lambda x: np.sin(x), color=BLUE)
        graph_cos = axes.plot(lambda x: np.cos(x), color=RED)
        area = axes.get_area(graph_sin, bounded_graph=graph_cos, x_range=[0, PI / 2], color=GREEN, opacity=0.5)
        label_sin = axes.get_graph_label(graph_sin, label="sin(x)", x_val=PI / 4, direction=UP)
        label_cos = axes.get_graph_label(graph_cos, label="cos(x)", x_val=PI / 4, direction=DOWN)
        self.add(axes)
        self.play(Create(graph_sin), Create(graph_cos))
        self.play(FadeIn(area))
        self.play(Write(label_sin), Write(label_cos))
        self.wait(2)