package com.digitacourse.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
public class Lesson {

    @Id
    @Column(length = 50)
    private String id;

    @Column(name = "module_id", nullable = false, length = 50)
    private String moduleId;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @Column(nullable = false)
    private int duration;

    @Column(nullable = false)
    private int xp;

    @Column(nullable = false, length = 80)
    private String focus;

    @Column(name = "lesson_text", nullable = false, columnDefinition = "text")
    private String text;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;
}
